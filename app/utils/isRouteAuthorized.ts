import { match } from 'path-to-regexp';

const pagesAuthorization = [
  {
    routePaths: [
      '/',
      '/analyst',
      '/applicantportal',
      '/analyst/request-access',
      '/error-500',
    ],
    isProtected: false,
  },
  {
    routePaths: ['/analyst/(.*)'],
    isProtected: true,
    allowedRoles: ['ccbc_admin', 'ccbc_analyst'],
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
