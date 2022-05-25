import ssoExpress from '@bcgov-cas/sso-express';
import config from '../../config';

const baseUrl =
  config.get('NODE_ENV') === 'production'
    ? `https://${config.get('HOST')}`
    : `https://localhost:${config.get('PORT') || 3000}`;

// get oidcIssuer url to adjust based on environment

export default async function ssoMiddleware() {
  return ssoExpress({
    applicationDomain: '.gov.bc.ca',
    getLandingRoute: () => {
      return '/dashboard';
    },
    oidcConfig: {
      baseUrl: baseUrl,
      clientId: 'conn-ccbc-portal-3700',
      oidcIssuer: `https://dev.oidc.gov.bc.ca/auth`,
      clientSecret: `${process.env.SSO_CLIENT_SECRET}`,
    },
  });
}
