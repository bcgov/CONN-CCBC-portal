/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import s3upload from 'backend/lib/s3upload';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

jest.mock('../../../backend/lib/s3client', () => {
  return {
    s3ClientV3: jest.fn().mockImplementation(() => {}),
    uploadFileToS3: () => {
      return new Promise((resolve) => {
        resolve(true);
      });
    },
  };
});

jest.setTimeout(10000000);

describe('The s3 download', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3upload);
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

  it('should receive the correct response for auth user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/s3/upload');
    expect(response.status).toBe(200);
  });

  jest.resetAllMocks();
});
