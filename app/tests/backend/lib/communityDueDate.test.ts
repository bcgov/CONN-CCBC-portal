/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import getConfig from 'next/config';
import communityDueDate from '../../../backend/lib/communityReportsDueDate';
import { performQuery } from '../../../backend/lib/graphql';
import handleEmailNotification from '../../../backend/lib/emails/handleEmailNotification';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');
jest.mock('../../../backend/lib/emails/handleEmailNotification');
jest.mock('next/config');

jest.setTimeout(100000);

describe('The Milestone excel import api route', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', communityDueDate);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/analyst/community/upcoming');
    expect(response.status).toBe(404);
  });

  it('should process community reports for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });
    mocked(getConfig).mockReturnValue({
      publicRuntimeConfig: {
        ENABLE_MOCK_TIME: true,
      },
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplicationSowData: {
            nodes: [
              {
                applicationId: 1,
                applicationByApplicationId: {
                  ccbcNumber: 'CCBC-010001',
                  organizationName: 'Organization Name',
                  projectName: 'Project Name',
                },
                jsonData: { projectStartDate: '2024-01-01' },
              },
            ],
          },
        },
      };
    });

    const response = await request(app)
      .get('/api/analyst/community/upcoming')
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'No community reports due in 30 days',
    });
  });

  it('should process community reports for authorized user and send email', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const mockDate = new Date('2021-12-03T00:00:00Z');
    const OriginalDate = Date;

    global.Date = jest.fn((dateString) => {
      if (dateString === undefined) {
        return mockDate;
      }
      return new OriginalDate(dateString);
    }) as unknown as DateConstructor;
    global.Date.now = OriginalDate.now;

    mocked(handleEmailNotification).mockImplementation(async (req, res) => {
      return res.status(200).json({ emails: 'sent' }).end();
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplicationSowData: {
            nodes: [
              {
                applicationId: 1,
                applicationByApplicationId: {
                  ccbcNumber: 'CCBC-010001',
                  organizationName: 'Organization Name',
                  projectName: 'Project Name',
                },
                jsonData: { projectStartDate: '2024-11-02' },
              },
            ],
          },
        },
      };
    });

    const response = await request(app).get('/api/analyst/community/upcoming');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ emails: 'sent' });
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
