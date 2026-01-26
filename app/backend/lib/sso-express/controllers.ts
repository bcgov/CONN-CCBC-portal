import type { Request, Response, NextFunction } from 'express';
import { BaseClient, generators, TokenSet } from 'openid-client';
import { URL } from 'whatwg-url';
import { getSessionRemainingTime, isAuthenticated } from './helpers';
import { SSOExpressOptions } from './types';
import config from '../../../config';
import { reportServerError } from '../emails/errorNotification';

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
    // needed for dev
    const baseUrl =
      config.get('NODE_ENV') === 'production'
        ? `https://${config.get('HOST')}`
        : `http://${config.get('HOST')}:${config.get('PORT') || 3000}`;

    const cookieRoles = req.cookies?.role || null;
    const isAnalyst =
      cookieRoles === 'analyst' ||
      cookieRoles === 'admin' ||
      cookieRoles === 'cbc_admin' ||
      cookieRoles === 'ccbc_analyst' ||
      cookieRoles === 'super_admin';

    // Clear the siteminder session token on logout if we can
    // This will be ignored by the user agent unless we're
    // currently deployed to a subdomain of gov.bc.ca
    res.clearCookie('SMSESSION', {
      domain: options.applicationDomain,
      secure: true,
    });

    res.clearCookie('role', {
      domain: options.applicationDomain,
      secure: false,
    });

    const baseRoute = isAnalyst ? '/analyst' : '/';
    const postLogoutRedirectUri = `${baseUrl}${baseRoute}`;

    if (!isAuthenticated(req)) {
      res.redirect(postLogoutRedirectUri);
      return;
    }

    delete req.session.tokenSet;

    // adding this will take the user to azure logout page
    // bypassing the end session url so users do not get stuck
    // res.redirect(
    //   client.endSessionUrl({
    //     id_token_hint: tokenSet,
    //     post_logout_redirect_uri: postLogoutRedirectUri,
    //   })
    // );
    res.redirect(postLogoutRedirectUri);
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
        reportServerError(err, {
          source: 'sso-token-refresh',
          logMessage: 'sso-express could not refresh the access token.',
          metadata: { token: tokenSet },
        });
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

    if (req.session.tokenSet) {
      reportServerError(
        new Error('loginController: req.session.tokenSet exists'),
        {
          source: 'sso-login-token-set',
          metadata: {
            session: req.session,
            codeVerifier,
            codeChallenge,
          },
        },
        req
      );
      delete req.session.tokenSet;
    }

    const baseRedirectUri = options.getRedirectUri(
      new URL(client.metadata.redirect_uris[0]),
      req
    ).href;

    const redirectTo = (req.query?.redirect as string) || null;

    const redirectUri = redirectTo
      ? `${baseRedirectUri}?redirect=${redirectTo}`
      : baseRedirectUri;

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

    // The check below is redundant as the oidc client
    // callback will check the state
    /*
    if (state !== cachedState) {
      res.redirect(options.oidcConfig.baseUrl);
      return;
    }
    */

    const callbackParams = client.callbackParams(req);

    try {
      const startTime = Date.now();
      const tokenSet = await client.callback(
        req.session.redirectUri,
        callbackParams,
        {
          state,
          code_verifier: sessionCodeVerifier,
        }
      );
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      // eslint-disable-next-line no-console
      console.log(`Elapsed time from callback: ${elapsedTime} milliseconds`);
      req.session.tokenSet = tokenSet;
      req.claims = tokenSet.claims();

      if (typeof options.onAuthCallback === 'function') {
        await options.onAuthCallback(req);
      }

      delete req.session.codeVerifier;

      const redirectTo = (req.query?.redirect as string) || null;

      res.redirect(
        redirectTo
          ? `${options.oidcConfig.baseUrl}${redirectTo}`
          : options.getLandingRoute(req)
      );
    } catch (err) {
      reportServerError(
        err,
        {
          source: 'sso-auth-callback',
          logMessage: 'sso-express could not get the access token.',
          metadata: {
            session: req.session,
            query: req.query,
            sessionCodeVerifier,
          },
        },
        req
      );
      res.redirect(options.oidcConfig.baseUrl);
    }
  };
