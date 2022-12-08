/**
 * @jest-environment node
 */
import s3download from 'backend/lib/s3download';
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

describe('The s3 download', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3download);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/s3/download/test/test');
    expect(response.status).toBe(404);
  });

  it('should receive the correct response for auth user with no env vars set', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/s3/download/test/test');
    expect(response.status).toBe(500);
  });

  jest.resetAllMocks();
});
