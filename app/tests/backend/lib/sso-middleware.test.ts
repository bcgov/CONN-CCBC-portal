/**
 * @jest-environment node
 */
import ssoMiddleware from 'backend/lib/sso-middleware';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { IDP_HINTS, IDP_HINT_PARAM } from 'data/ssoConstants';

describe('The sso middleware', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use(await ssoMiddleware());
  });

  it('should forward valid kc_idp_hint parameters on login', async () => {
    Object.values(IDP_HINTS).forEach(async (idpHint) => {
      const response = await request(app).post(
        `/login?${IDP_HINT_PARAM}=${idpHint}`
      );
      expect(response.status).toBe(302);
      expect(response.headers.location).toInclude(
        `${IDP_HINT_PARAM}=${idpHint}`
      );
    });
  });

  it('should ignore invalid kc_idp_hint parameters', async () => {
    const response = await request(app).post(
      `/login?${IDP_HINT_PARAM}=notAValidIDP`
    );
    expect(response.status).toBe(302);
    expect(response.headers.location).not.toInclude(
      `${IDP_HINT_PARAM}=notAValidIDP`
    );
  });
});
