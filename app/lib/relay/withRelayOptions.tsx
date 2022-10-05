import type { NextPageContext } from 'next';
import { WiredOptions } from 'relay-nextjs/wired/component';
import { NextRouter } from 'next/router';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import { getClientEnvironment } from './client';

const withRelayOptions: WiredOptions<any> = {
  fallback: <div>Loading...</div>,
  ErrorComponent: (props) => {
    throw props.error;
  },
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx: NextPageContext) => {
    const { createServerEnvironment } = await import('./server');
    return createServerEnvironment({ cookieHeader: ctx?.req?.headers.cookie });
  },
  serverSideProps: async (ctx: NextPageContext) => {
    // Server-side redirection of the user to their landing route, if they are logged in
    const request = ctx.req as any;
    const authenticated = isAuthenticated(request);
    // They're logged in.
    if (authenticated) {
      return {};
    }
    // Handle not logged in
    return {
      redirect: {
        destination: '/',
      },
    };
  },
  variablesFromContext: (ctx: NextPageContext | NextRouter) => ({
    ...ctx.query,
  }),
};

export default withRelayOptions;
