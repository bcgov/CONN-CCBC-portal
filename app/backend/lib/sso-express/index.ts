import { Router } from 'express';
import { Issuer } from 'openid-client';
import type { IdTokenClaims, TokenSetParameters } from 'openid-client';
import { getSessionRemainingTime, isAuthenticated } from './helpers';
import {
  authCallbackController,
  loginController,
  logoutController,
  sessionIdleRemainingTimeController,
  tokenSetController,
} from './controllers';
import { SSOExpressOptions } from './types';

type GetAroundSonarCloudComplaint = (any) => void;

export { getSessionRemainingTime, isAuthenticated };
declare global {
  namespace Express {
    export interface Request {
      session?: {
        oidcState?: string;
        tokenSet?: TokenSetParameters;
        codeVerifier?: string;
        [key: string]: any;
      };
      claims?: IdTokenClaims;
    }
  }
}
// Options:
const defaultOptions: Partial<SSOExpressOptions> = {
  applicationDomain: '.gov.bc.ca',
  getLandingRoute: () => '/',
  getRedirectUri: (defaultRedirectUri) => defaultRedirectUri,
  bypassAuthentication: {
    login: false,
    sessionIdleRemainingTime: false,
  }, // set to false if disabled, true if you want to bypass auth in dev environments, fine-tuning by passing an object with the same keys as the routes (supported so far are 'login' and 'sessionIdleRemainingTime')
  routes: {
    login: '/login',
    logout: '/logout',
    sessionIdleRemainingTime: '/session-idle-remaining-time',
    authCallback: '/auth-callback',
    extendSession: '/extend-session',
  },
  authorizationUrlParams: {},
};

async function ssoExpress(opts: SSOExpressOptions) {
  if (!opts.oidcConfig)
    throw new Error('sso-express: oidcConfig key not provided in options');

  const options: SSOExpressOptions = {
    ...defaultOptions,
    ...opts,
    routes: {
      ...defaultOptions.routes,
      ...opts.routes,
    },
  };

  const { clientId, clientSecret, baseUrl, oidcIssuer } = options.oidcConfig;
  const {
    authCallback,
    login,
    logout,
    sessionIdleRemainingTime,
    extendSession,
  } = options.routes;

  const issuer = await Issuer.discover(oidcIssuer);
  const { Client } = issuer;
  const client = new Client({
    client_id: clientId,
    client_secret: clientSecret, // pragma: allowlist secret
    redirect_uris: [`${baseUrl}${authCallback}`],
    post_logout_redirect_uris: [baseUrl],
    token_endpoint_auth_method: clientSecret ? 'client_secret_basic' : 'none',
  });

  // Creating a router middleware on which we'll add all the specific routes and additional middlewares.
  const middleware = Router();

  // also create a get logout to be used by the onSessionExpired callbaack
  middleware.get(logout, logoutController(client, options));
  middleware.post(logout, logoutController(client, options));

  const tokenSetControllerMidWare: unknown = tokenSetController(
    client,
    options,
    sessionIdleRemainingTime
  );

  middleware.use(tokenSetControllerMidWare as GetAroundSonarCloudComplaint);

  // Session Idle Remaining Time
  // Returns, in seconds, the amount of time left in the session
  if (sessionIdleRemainingTime)
    middleware.get(
      sessionIdleRemainingTime,
      sessionIdleRemainingTimeController(client, options)
    );

  middleware.post(login, loginController(client, options));
  const authCallBackMidWare: unknown = authCallbackController(client, options);
  middleware.get(
    authCallback,
    authCallBackMidWare as GetAroundSonarCloudComplaint
  );
  // create a separate extend-session callback
  middleware.get(
    extendSession,
    sessionIdleRemainingTimeController(client, options)
  );

  return middleware;
}

export default ssoExpress;
