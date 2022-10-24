import { Request } from 'express';

const getAuthRole = (req: Request) => {
  if (!req?.claims)
    return {
      pgRole: 'ccbc_guest',
      landingRoute: '/',
    };

  const idp = req.claims.identity_provider;
  const roles = req.claims.client_roles as any;
  const isAdmin = roles?.includes('admin');
  const isAnalyst = roles?.includes('analyst');
  if (idp === 'idir') {
    if (isAdmin) {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/analyst/dashboard',
      };
    }
    if (isAnalyst) {
      return {
        pgRole: 'ccbc_analyst',
        landingRoute: '/analyst/dashboard',
      };
    }
    return {
      pgRole: 'ccbc_guest',
      landingRoute: '/analyst/request-access',
    };
  }
  return {
    pgRole: 'ccbc_auth_user',
    landingRoute: '/applicantportal/dashboard',
  };
};
export default getAuthRole;
