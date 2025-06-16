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

describe('logout', () => {
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

  it('should redirect analysts to /analyst', async () => {
    app = express();
    app.use(passport.initialize());
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    // Mock middleware to set claims for analyst
    app.use((req, res, next) => {
      req.session = req.session || {};
      req.session.tokenSet = { id_token: 'dummy' };
      req.claims = { identity_provider: 'idir', client_roles: ['analyst'] };
      next();
    });
    app.use('/', logout);
    const response = await request(app).post('/api/logout');
    expect(response.text).toContain('analyst');
  });

  it('should redirect admins to /analyst', async () => {
    app = express();
    app.use(passport.initialize());
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    // Mock middleware to set claims for admin
    app.use((req, res, next) => {
      req.session = req.session || {};
      req.session.tokenSet = { id_token: 'dummy' };
      req.claims = { identity_provider: 'idir', client_roles: ['admin'] };
      next();
    });
    app.use('/', logout);
    const response = await request(app).post('/api/logout');
    expect(response.text).toContain('analyst');
  });

  it('should redirect to /analyst if cookie role is analyst and roles are empty', async () => {
    app = express();
    app.use(passport.initialize());
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    // Mock middleware to set empty roles and cookie
    app.use((req, res, next) => {
      req.session = req.session || {};
      req.session.tokenSet = { id_token: 'dummy' };
      req.claims = { identity_provider: 'idir', client_roles: [] };
      req.cookies = { role: 'analyst' };
      next();
    });
    app.use('/', logout);
    const response = await request(app).post('/api/logout');
    expect(response.text).toContain('analyst');
  });

  jest.resetAllMocks();
});
