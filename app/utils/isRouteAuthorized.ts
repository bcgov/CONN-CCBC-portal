import { match } from 'path-to-regexp';

const pagesAuthorization = [
  {
    routePaths: [
      '/',
      '/analystportal',
      '/applicantportal',
      '/analystportal/request-access',
    ],
    isProtected: false,
  },
  {
    routePaths: ['/analystportal/(.*)'],
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
