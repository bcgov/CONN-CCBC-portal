/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import coveragesUpload from 'backend/lib/coverages-upload';
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

describe('The coverages upload', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', coveragesUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/coverages/upload');
    expect(response.status).toBe(404);
  });

  it('should receive the correct response for auth user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/coverages/upload');
    expect(response.status).toBe(200);
  });

  it('should upload any file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/coverages/upload')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'gis-data' }))
      .attach('gis-data', `${__dirname}/gis-data-200.json`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  jest.resetAllMocks();
});
