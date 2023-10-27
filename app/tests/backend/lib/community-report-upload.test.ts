/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import communityReportUpload from '../../../backend/lib/community-report-upload';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = jest.fn(() => {
  return FormDataMock();
}) as jest.Mock;

jest.setTimeout(100000);

describe('The Community Progress Report import', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', communityReportUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/analyst/community-report/1/1'
    );
    expect(response.status).toBe(404);
  });

  it('should process uploaded file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementationOnce(async () => {
      return {
        data: {
          applicationByRowId: {
            ccbcNumber: 'CCBC-020042',
          },
        },
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationCommunityReportData: {
            applicationCommunityReportData: { rowId: 1 },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/community-report/10/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'community-report-data' }))
      .attach('community-report-data', `${__dirname}/community_report.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should validate uploaded file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementationOnce(async () => {
      return {
        data: {
          applicationByRowId: {
            ccbcNumber: 'CCBC-020042',
          },
        },
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/community-report/10/1?validate=true')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'community_report-data' }))
      .attach('community-report-data', `${__dirname}/community_report.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);

    expect(performQuery).toHaveBeenCalledOnce();
  });

  it('should return error if file does not have expected worksheets', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/community-report/10/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'community-report-data' }))
      .attach('community_report-data', `${__dirname}/sow_200.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'workbook',
        error: `missing required sheet "Sheet 1". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
    ]);
  });

  it('should return error if file is not filled out properly', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementationOnce(async () => {
      return {
        data: {
          applicationByRowId: {
            ccbcNumber: 'CCBC-020041',
          },
        },
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/community-report/10/1?validate=true')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'community_report-data' }))
      .attach(
        'community-report-data',
        `${__dirname}/community_report_with_error.xlsx`
      )
      .expect(400);

    const responseDataJson = JSON.parse(response.text);
    expect(responseDataJson).toBeArray();
    expect(responseDataJson[0].error).toBe('Invalid data: Community Name 123');
    expect(responseDataJson[1].error).toBe(
      'CCBC Number mismatch: expected CCBC-020041, received: CCBC-020042'
    );
  });

  it('should not return error if file is missing data', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementationOnce(async () => {
      return {
        data: {
          applicationByRowId: {
            ccbcNumber: 'CCBC-020041',
          },
        },
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationSowData: { applicationSowData: { rowId: 1 } },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/community-report/10/1?validate=true')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'community_report-data' }))
      .attach(
        'community-report-data',
        `${__dirname}/community_report_with_missing_data.xlsx`
      )
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.ok).toBeTrue();
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
