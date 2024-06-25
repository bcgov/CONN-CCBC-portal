import { match } from 'path-to-regexp';

const pagesAuthorization = [
  {
    routePaths: [
      '/',
      '/analyst',
      '/applicantportal',
      '/analyst/request-access',
    ],
    isProtected: false,
  },
  {
    routePaths: ['/analyst/application/(.*)'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst', 'cbc_admin'],
  },
  {
    routePaths: ['/analyst/cbc/(.*)/edit'],
    isProtected: true,
    allowedRoles: ['cbc_admin'],
  },
  {
    routePaths: ['/analyst/cbc/(.*)/'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst', 'cbc_admin'],
  },
  {
    routePaths: ['/analyst/dashboard'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst', 'cbc_admin'],
  },
  {
    routePaths: ['/analyst/assessments'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst', 'cbc_admin'],
  },
  {
    routePaths: ['/analyst/gis/(.*)'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst', 'cbc_admin'],
  },
  {
    routePaths: ['/analyst/admin/(.*)'],
    isProtected: true,
    allowedRoles: ['ccbc_admin'],
  },
  {
    routePaths: ['/applicantportal/(.*)'],
    isProtected: true,
    allowedRoles: ['ccbc_auth_user'],
  },
];

const isRouteAuthorized = (route: string, pgRole: string) => {
  const authRules = pagesAuthorization.find(({ routePaths }) =>
    routePaths.some((routePath) =>
      match(routePath, { decode: decodeURIComponent, endsWith: '?' })(route)
    )
  );
  if (!authRules) {
    return false;
  }
  const { isProtected, allowedRoles = [] } = authRules;
  if (!isProtected) {
    return true;
  }
  return allowedRoles.some((role) => pgRole === role);
};

export default isRouteAuthorized;
