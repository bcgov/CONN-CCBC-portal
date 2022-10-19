import ssoExpress from '@bcgov-cas/sso-express';
import { IDP_HINTS, IDP_HINT_PARAM } from '../../data/ssoConstants';
import config from '../../config';
import createUserMiddleware from './createUser';
import getAuthRole from '../../utils/getAuthRole';

const baseUrl =
  config.get('NODE_ENV') === 'production'
    ? `https://${config.get('HOST')}`
    : `http://${config.get('HOST')}:${config.get('PORT') || 3000}`;

let oidcIssuer: string;

const mockAuth = config.get('ENABLE_MOCK_AUTH');

if (
  config.get('OPENSHIFT_APP_NAMESPACE').endsWith('-dev') ||
  config.get('OPENSHIFT_APP_NAMESPACE') === ''
)
  oidcIssuer = 'dev.loginproxy.gov.bc.ca';
else if (config.get('OPENSHIFT_APP_NAMESPACE').endsWith('-test'))
  oidcIssuer = 'test.loginproxy.gov.bc.ca';
else oidcIssuer = 'loginproxy.gov.bc.ca';

export default async function ssoMiddleware() {
  return ssoExpress({
    applicationDomain: '.gov.bc.ca',
    getLandingRoute: (req) => {
      return getAuthRole(req).landingRoute;
    },
    bypassAuthentication: {
      login: mockAuth,
      sessionIdleRemainingTime: mockAuth,
    },
    oidcConfig: {
      baseUrl,
      clientId: 'conn-ccbc-portal-3934',
      oidcIssuer: `https://${oidcIssuer}/auth/realms/standard`,
      clientSecret: `${config.get('CLIENT_SECRET')}`,
    },
    onAuthCallback: createUserMiddleware(),
    authorizationUrlParams: (req) => {
      if (
        Object.values(IDP_HINTS).includes(req.query[IDP_HINT_PARAM] as string)
      )
        return { [IDP_HINT_PARAM]: req.query[IDP_HINT_PARAM] as string };

      return {};
    },
  });
}
