/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import crypto from 'crypto';
import logout from '../../../backend/lib/logout';

jest.mock('../../../backend/lib/graphql');

describe('The s3 download', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(passport.initialize());
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', logout);
  });

  it('should receive the correct response', async () => {
    const response = await request(app).post('/api/logout');
    expect(response.status).toBe(302);
  });

  it('should redirect to the correct route', async () => {
    const response = await request(app).post('/api/logout');
    expect(response.text).toContain(
      'Found. Redirecting to https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl='
    );
  });

  jest.resetAllMocks();
});
