/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import metabaseEmbedUrl from '../../../backend/lib/metabase-embed-url';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

const sign = jest.spyOn(jwt, 'sign');
sign.mockImplementation(() => 'signedUrl');

jest.setTimeout(1000);

describe('The metabase embed url', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', metabaseEmbedUrl);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/metabase-embed-url/1');

    expect(response.status).toBe(404);
  });

  it('should receive the correct response for analyst', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/metabase-embed-url/1');
    expect(response.status).toBe(200);
  });

  it('should receive the correct embed url', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/metabase-embed-url/1');

    expect(response.body.url).toInclude('/embed/dashboard');
  });

  jest.resetAllMocks();
});
