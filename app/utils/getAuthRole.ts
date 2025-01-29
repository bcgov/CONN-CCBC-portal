import { Request } from 'express';
import config from '../config';

const defaultLandingRoutes = {
  ccbc_guest: '/',
  ccbc_admin: '/analyst/dashboard',
  ccbc_analyst: '/analyst/dashboard',
  ccbc_auth_user: '/applicantportal/dashboard',
};

const getAuthRole = (req: Request) => {
  if (config.get('ENABLE_MOCK_AUTH')) {
    const mockUserRole = req.cookies?.[config.get('MOCK_ROLE_COOKIE_NAME')];
    return {
      pgRole: mockUserRole,
      landingRoute: defaultLandingRoutes[mockUserRole],
    };
  }
  // Temp logging claims to help resolve
  // denied issue to session
  // eslint-disable-next-line no-console
  console.log(
    req?.claims
      ? `Claims: ${req?.claims?.identity_provider}, ${req?.claims?.client_roles}`
      : 'No claims found'
  );
  if (!req?.claims)
    return {
      pgRole: 'ccbc_guest',
      landingRoute: defaultLandingRoutes.ccbc_guest,
    };

  const idp = req.claims.identity_provider;
  const roles = req.claims.client_roles as any;
  const isAdmin = roles?.includes('admin');
  const isAnalyst = roles?.includes('analyst');
  const isCbcAdmin = roles?.includes('cbc_admin');

  if (idp === 'idir' || idp === 'azureidir') {
    if (isCbcAdmin && isAdmin) {
      return {
        pgRole: 'super_admin',
        landingRoute: defaultLandingRoutes.ccbc_admin,
      };
    }
    if (isCbcAdmin) {
      return {
        pgRole: 'cbc_admin',
        landingRoute: defaultLandingRoutes.ccbc_analyst,
      };
    }
    if (isAdmin) {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: defaultLandingRoutes.ccbc_admin,
      };
    }
    if (isAnalyst) {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: defaultLandingRoutes.ccbc_analyst,
      };
    }
    return {
      pgRole: 'ccbc_guest',
      landingRoute: '/analyst/request-access',
    };
  }

  if (idp === 'bceidbusiness' && isAnalyst) {
    return {
      pgRole: 'ccbc_analyst',
      landingRoute: defaultLandingRoutes.ccbc_analyst,
    };
  }

  if (idp === 'serviceaccount') {
    return {
      pgRole: 'ccbc_service_account',
      landingRoute: null,
    };
  }

  return {
    pgRole: 'ccbc_auth_user',
    landingRoute: defaultLandingRoutes.ccbc_auth_user,
  };
};
export default getAuthRole;
