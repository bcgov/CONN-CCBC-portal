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

  if (!req?.claims)
    return {
      pgRole: 'ccbc_guest',
      landingRoute: defaultLandingRoutes.ccbc_guest,
    };

  const idp = req.claims.identity_provider;
  const roles = req.claims.client_roles as any;
  const isAdmin = roles?.includes('admin');
  const isAnalyst = roles?.includes('analyst');
  if (idp === 'idir') {
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
  return {
    pgRole: 'ccbc_auth_user',
    landingRoute: defaultLandingRoutes.ccbc_auth_user,
  };
};
export default getAuthRole;
