import type { Request } from 'express';

export interface SSOExpressOptions {
  oidcConfig: {
    /**
     * If using keycloak this should be the realm url, e.g. https://oidc.gov.bc.ca/auth/realms/myrealm
     */
    oidcIssuer: string;
    clientId: string;
    clientSecret?: string;
    /**
     * The url of the application, accessible from the user's browser e.g. https://myapp.gov.bc.ca,
     * or http://localhost:3000 when doing local development
     */
    baseUrl: string;
  };
  applicationDomain?: string;
  getLandingRoute?: (req: Request) => string;

  /**
   * Function used to build the redirect uri for the oidc provider.
   * The default implementation uses the {baseUrl}/{route.authCallback} from these options.
   *
   * @param defaultRedirectUri The default redirect uri
   * @param req The request object passed to the middleware, useful for passing and retrieving additional url params
   *
   * @returns The redirect uri to use
   */
  getRedirectUri?: (defaultRedirectUri: URL, req: Request) => URL;
  bypassAuthentication?: {
    login?: boolean;
    sessionIdleRemainingTime?: boolean;
  };
  routes?: {
    login?: string;
    logout?: string;
    sessionIdleRemainingTime?: string;
    authCallback?: string;
    extendSession?: string;
  };
  authorizationUrlParams?:
    | Record<string, string>
    | ((req: Request) => Record<string, string>);

  /**
   * Callback function called after the user is authenticated,
   * but before the user is redirected to the landing page.
   *
   * @param req The request object, containing req.claims and req.session.tokenSet
   */
  onAuthCallback?: (req: Request) => Promise<void> | void;
}
