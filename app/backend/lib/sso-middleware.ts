import ssoExpress from '@bcgov-cas/sso-express';
import config from '../../config';
import createUserMiddleware from './createUser';

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
    getLandingRoute: () => {
      return '/dashboard';
    },
    bypassAuthentication: {
      login: mockAuth,
      sessionIdleRemainingTime: mockAuth,
    },
    oidcConfig: {
      baseUrl: baseUrl,
      clientId: 'conn-ccbc-portal-3934',
      oidcIssuer: `https://${oidcIssuer}/auth/realms/standard`,
      clientSecret: `${config.get('CLIENT_SECRET')}`,
    },
    onAuthCallback: createUserMiddleware(),
  });
}
