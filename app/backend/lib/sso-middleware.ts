import ssoExpress from '@bcgov-cas/sso-express';

// get oidcIssuer url to adjust based on environment
// baseUrl to adjust based on environment

export default async function ssoMiddleware() {
  return ssoExpress({
    applicationDomain: '.gov.bc.ca',
    getLandingRoute: () => {
      return '/dashboard';
    },
    oidcConfig: {
      baseUrl: 'http://localhost:3000',
      clientId: 'conn-ccbc-portal-3700',
      oidcIssuer: `https://dev.oidc.gov.bc.ca/auth`,
      clientSecret: `${process.env.SSO_CLIENT_SECRET}`,
    },
  });
}
