/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import changeLog from '../../../../backend/lib/change_log/change_log';
import { performQuery } from '../../../../backend/lib/graphql';
import { gbClient } from '../../../../backend/lib/growthbook-client';

jest.mock('../../../../backend/lib/graphql');
jest.mock('../../../../backend/lib/growthbook-client', () => ({
  gbClient: {
    refreshFeatures: jest.fn(),
    getFeatureValue: jest.fn(),
  },
}));

const buildChangeLogResponse = (nodes) => ({
  data: {
    changeLog: {
      nodes,
    },
  },
});

describe('Change log cache endpoints', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use(express.json());
    app.use('/', changeLog);
    mocked(gbClient.refreshFeatures).mockResolvedValue(undefined);
    mocked(gbClient.getFeatureValue).mockReturnValue({});
    jest.clearAllMocks();
  });

  it('returns cached change log data when available', async () => {
    mocked(performQuery).mockResolvedValueOnce({
      data: {
        allChangeLogData: {
          nodes: [
            {
              rowId: 1,
              jsonData: { allCbcs: [], allApplications: [] },
              updatedAt: '2026-02-04T18:00:00.000Z',
            },
          ],
        },
      },
    });

    const response = await request(app).get('/api/change-log').expect(200);

    expect(response.body.source).toBe('cache');
    expect(response.body.updatedAt).toBe('2026-02-04T18:00:00.000Z');
    expect(response.body.data).toEqual({
      allCbcs: [],
      allApplications: [],
    });
    expect(mocked(performQuery)).toHaveBeenCalledTimes(1);
  });

  it('generates and stores change log data when cache is empty', async () => {
    mocked(performQuery)
      .mockResolvedValueOnce({
        data: { allChangeLogData: { nodes: [] } },
      })
      .mockResolvedValueOnce(
        buildChangeLogResponse([
          { tableName: 'cbc_data', id: 1 },
          { tableName: 'application', id: 2 },
        ])
      )
      .mockResolvedValueOnce({
        data: {
          createChangeLogData: {
            changeLogData: {
              rowId: 5,
              updatedAt: '2026-02-04T18:05:00.000Z',
            },
          },
        },
      });

    const response = await request(app).get('/api/change-log').expect(200);

    expect(response.body.source).toBe('generated');
    expect(response.body.updatedAt).toBe('2026-02-04T18:05:00.000Z');
    expect(response.body.data).toEqual({
      allCbcs: [{ tableName: 'cbc_data', id: 1 }],
      allApplications: [{ tableName: 'application', id: 2 }],
    });
    expect(mocked(performQuery)).toHaveBeenCalledTimes(3);
  });

  it('returns no updates when counts match on refresh', async () => {
    mocked(performQuery)
      .mockResolvedValueOnce({
        data: {
          allChangeLogData: {
            nodes: [
              {
                rowId: 2,
                jsonData: {
                  allCbcs: [{ id: 1 }],
                  allApplications: [{ id: 2 }],
                },
                updatedAt: '2026-02-04T18:10:00.000Z',
              },
            ],
          },
        },
      })
      .mockResolvedValueOnce(
        buildChangeLogResponse([
          { tableName: 'cbc_data', id: 1 },
          { tableName: 'application', id: 2 },
        ])
      );

    const response = await request(app)
      .get('/api/change-log/refresh')
      .expect(200);

    expect(response.body.hasUpdates).toBe(false);
    expect(response.body.updatedAt).toBe('2026-02-04T18:10:00.000Z');
    expect(mocked(performQuery)).toHaveBeenCalledTimes(2);
  });

  it('updates cache when counts differ on refresh', async () => {
    mocked(performQuery)
      .mockResolvedValueOnce({
        data: {
          allChangeLogData: {
            nodes: [
              {
                rowId: 11,
                jsonData: {
                  allCbcs: [{ id: 1 }],
                  allApplications: [],
                },
                updatedAt: '2026-02-04T18:20:00.000Z',
              },
            ],
          },
        },
      })
      .mockResolvedValueOnce(
        buildChangeLogResponse([
          { tableName: 'cbc_data', id: 1 },
          { tableName: 'application', id: 2 },
        ])
      )
      .mockResolvedValueOnce({
        data: {
          updateChangeLogDataByRowId: {
            changeLogData: {
              updatedAt: '2026-02-04T18:25:00.000Z',
            },
          },
        },
      });

    const response = await request(app)
      .get('/api/change-log/refresh')
      .expect(200);

    expect(response.body.hasUpdates).toBe(true);
    expect(response.body.updatedAt).toBe('2026-02-04T18:25:00.000Z');
    expect(mocked(performQuery)).toHaveBeenCalledTimes(3);
  });
});
