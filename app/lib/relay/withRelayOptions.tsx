import type { NextPageContext } from 'next';
import type { RelayOptions } from 'relay-nextjs';
import { NextRouter } from 'next/router';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import { CircularProgress, Box } from '@mui/material';
import safeJsonParse from 'lib/helpers/safeJsonParse';
import { DEFAULT_PAGE_SIZE } from 'components/Table/Pagination';
import { getClientEnvironment } from './client';
import isRouteAuthorized from '../../utils/isRouteAuthorized';

const withRelayOptions: RelayOptions<any, any> = {
  fallback: (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress size={40} />
    </Box>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx: NextPageContext) => {
    const { createServerEnvironment } = await import('./server');
    return createServerEnvironment({ cookieHeader: ctx?.req?.headers.cookie });
  },
  serverSideProps: async (ctx: NextPageContext) => {
    const { default: getAuthRole } = await import('../../utils/getAuthRole');
    // Server-side redirection of the user to their landing route, if they are logged in
    const request = ctx.req as any;
    const authRole = getAuthRole(request);
    const authenticated = isAuthenticated(request);
    const routeAuthorized = isRouteAuthorized(request.url, authRole.pgRole);
    // They're logged in and authorized to access the page or the page is not protected
    if (routeAuthorized) {
      return {};
    }

    // They're logged in but they are not authorized to access the page
    if (authenticated) {
      return {
        redirect: {
          destination: authRole.landingRoute,
        },
      };
    }

    // Redirect them to landing route responding to the page they are trying to access
    return {
      redirect: {
        destination: request.url.startsWith('/analyst')
          ? `/analyst?redirect=${request.url}`
          : '/applicantportal',
      },
    };
  },
  variablesFromContext: (ctx: NextPageContext | NextRouter) => {
    const filterArgs = safeJsonParse(ctx.query.filterArgs as string);
    const pageArgs = safeJsonParse(ctx.query.pageArgs as string);

    return {
      ...ctx.query,
      ...filterArgs,
      pageSize: DEFAULT_PAGE_SIZE,
      ...pageArgs,
    };
  },
};

export default withRelayOptions;
