/**
 * @jest-environment node
 */
import s3archive from 'backend/lib/s3archive';
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

describe('The s3 archive', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3archive);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/analyst/archive');
    expect(response.status).toBe(404);
  });

  it('should receive the correct response for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplications: {
            nodes: [
              {
                formData: {
                  jsonData: {},
                },
                ccbcNumber: 'CCBC-100001',
              },
            ],
          },
        },
      };
    });

    const response = await request(app).get('/api/analyst/archive');

    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toMatch(
      /attachment; filename=CCBC applications/
    );

    expect(response.headers['content-type']).toBe('application/zip');
  });

  jest.resetAllMocks();
});
