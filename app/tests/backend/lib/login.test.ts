/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import crypto from 'crypto';
import login from '../../../backend/lib/login';

jest.mock('../../../backend/lib/graphql');

describe('The s3 download', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(passport.initialize());
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', login);
  });

  it('should receive the correct response', async () => {
    const response = await request(app).post('/api/login/multi-auth');
    expect(response.status).toBe(307);
  });

  it('should redirect to the correct route', async () => {
    const response = await request(app).post(
      '/api/login/login?https://dev.loginproxy.gov.bc.ca/test-login-route'
    );
    expect(response.req.path).toBe(
      '/api/login/login?https://dev.loginproxy.gov.bc.ca/test-login-route'
    );
  });

  jest.resetAllMocks();
});
