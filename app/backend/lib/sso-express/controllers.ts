import type { Request, Response, NextFunction } from 'express';
import { BaseClient, generators, TokenSet } from 'openid-client';
import { URL } from 'url';
import * as Sentry from '@sentry/nextjs';
import { getSessionRemainingTime, isAuthenticated } from './helpers';
import { SSOExpressOptions } from './types';

const shouldBypassAuthentication = (bypassConfig, routeKey) => {
  return (
    bypassConfig && // will fail if 'null' (which has the type object)
    (bypassConfig === true ||
      (typeof bypassConfig === 'object' && bypassConfig[routeKey]))
  );
};

export const logoutController =
  (client: BaseClient, options: SSOExpressOptions) =>
  (req: Request, res: Response) => {
    // Clear the siteminder session token on logout if we can
    // This will be ignored by the user agent unless we're
    // currently deployed to a subdomain of gov.bc.ca
    res.clearCookie('SMSESSION', {
      domain: options.applicationDomain,
      secure: true,
    });

    if (!isAuthenticated(req)) {
      res.redirect(client.metadata.post_logout_redirect_uris[0]);
      return;
    }

    const tokenSet = new TokenSet(req.session.tokenSet);
    delete req.session.tokenSet;

    res.redirect(
      client.endSessionUrl({
        id_token_hint: tokenSet,
      })
    );
  };

export const tokenSetController =
  (
    client: BaseClient,
    _options: SSOExpressOptions,
    idleRemainingRoute = '/session-idle-remaining-time'
  ) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    if (isAuthenticated(req)) {
      const extend = req.url !== idleRemainingRoute;
      let tokenSet = new TokenSet(req.session.tokenSet);
      // Check if the access token is expired
      try {
        if (extend && tokenSet.expired()) {
          // If so, use the refresh token to get a new access token
          tokenSet = await client.refresh(tokenSet);
          // even if the token set is not expired, this will still add the TokenSet instance methods
        }
        req.session.tokenSet = tokenSet;
        req.claims = tokenSet.claims();
      } catch (err) {
        console.error('sso-express could not refresh the access token.');
        Sentry.captureException({ token: tokenSet, error: err });
        delete req.session.tokenSet;
      }
    }
    next();
  };

export const sessionIdleRemainingTimeController =
  (_client: BaseClient, options: SSOExpressOptions) =>
  (req: Request, res: Response) => {
    if (
      shouldBypassAuthentication(
        options.bypassAuthentication,
        'sessionIdleRemainingTime'
      )
    ) {
      return res.json(3600);
    }

    return res.json(getSessionRemainingTime(req));
  };

export const loginController =
  (client: BaseClient, options: SSOExpressOptions) =>
  (req: Request, res: Response) => {
    if (
      isAuthenticated(req) ||
      shouldBypassAuthentication(options.bypassAuthentication, 'login')
    ) {
      res.redirect(302, options.getLandingRoute(req));
      return;
    }

    const state = generators.random(32);

    // Code challenge and code verifier for PKCE support. If the clientSecret is set
    // in the oidcConfig, then code challenge options will be included in the auth
    // request session.
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    req.session.codeVerifier = codeVerifier;

    const redirectUri = options.getRedirectUri(
      new URL(client.metadata.redirect_uris[0]),
      req
    ).href;

    req.session.redirectUri = redirectUri;

    const urlParams =
      typeof options.authorizationUrlParams === 'function'
        ? options.authorizationUrlParams(req)
        : options.authorizationUrlParams;

    const authUrl = client.authorizationUrl({
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: redirectUri,
      ...urlParams,
    });

    res.redirect(authUrl);
  };

export const authCallbackController =
  (client: BaseClient, options: SSOExpressOptions) =>
  async (req: Request, res: Response) => {
    const state = req.query.state as string;
    const sessionCodeVerifier = req.session.codeVerifier;
    delete req.session.codeVerifier;

    // The check below is redundant as the oidc client
    // callback will check the state
    /*
    if (state !== cachedState) {
      Sentry.captureException({ state, cachedState });
      res.redirect(options.oidcConfig.baseUrl);
      return;
    }
    */

    const callbackParams = client.callbackParams(req);

    try {
      const tokenSet = await client.callback(
        req.session.redirectUri,
        callbackParams,
        {
          state,
          code_verifier: sessionCodeVerifier,
        }
      );
      req.session.tokenSet = tokenSet;
      req.claims = tokenSet.claims();

      if (typeof options.onAuthCallback === 'function') {
        await options.onAuthCallback(req);
      }

      res.redirect(options.getLandingRoute(req));
    } catch (err) {
      console.error('sso-express could not get the access token.');
      Sentry.captureException({ error: err, session: req.session });
      res.redirect(options.oidcConfig.baseUrl);
    }
  };
