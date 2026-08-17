/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import reportClientError from 'lib/helpers/reportClientError';
import config from '../../../config';
import communityDueDate from '../../../backend/lib/communityReportsDueDate';
import { performQuery } from '../../../backend/lib/graphql';
import handleEmailNotification from '../../../backend/lib/emails/handleEmailNotification';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');
jest.mock('../../../backend/lib/emails/handleEmailNotification');

jest.setTimeout(100000);

describe('The Community Progress Report api route', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(
      session({ secret: crypto.randomUUID(), cookie: { secure: false } })
    );
    app.use(cookieParser());
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
    // Spy rather than replace config.get entirely: other modules imported in
    // this chain (e.g. backend/lib/s3client.ts) read real config values like
    // AWS_S3_REGION at module load time and need their real defaults intact.
    const realConfigGet = config.get.bind(config);
    jest.spyOn(config, 'get').mockImplementation((name: any) => {
      if (name === 'ENABLE_MOCK_TIME') return true;
      return realConfigGet(name);
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
    try {
      const response = await request(app)
        .get('/api/analyst/community/upcoming')
        .set('Cookie', ['mocks.mocked_date=2020-11-01'])
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'No community reports due in 30 days',
      });
    } catch (err) {
      console.error(err);
      reportClientError(err, { source: 'community-due-date-test' });
    }
  });

  it('should process community reports for authorized user and send email', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

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
              {
                applicationId: 1,
                applicationByApplicationId: {
                  ccbcNumber: 'CCBC-010002',
                  organizationName: 'Organization Name',
                  projectName: 'Project Name',
                },
                jsonData: { projectStartDate: '2050-12-02' },
              },
            ],
          },
        },
      };
    });

    try {
      const response = await request(app)
        .get('/api/analyst/community/upcoming')
        .set('Cookie', ['mocks.mocked_date=2024-11-01']);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ emails: 'sent' });
    } catch (err) {
      console.error(err);
      reportClientError(err, { source: 'community-due-date-test-email' });
    }
  });

  afterEach(async () => {
    // await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    jest.resetAllMocks();
  });
});
