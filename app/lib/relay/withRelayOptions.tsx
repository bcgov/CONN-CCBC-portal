import { getClientEnvironment } from './client';
import type { NextPageContext } from 'next';
import { WiredOptions } from 'relay-nextjs/wired/component';
import { NextRouter } from 'next/router';

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
    // Take care of this logic in page routes
    return {};
  },
  variablesFromContext: (ctx: NextPageContext | NextRouter) => {
    return {
      ...ctx.query,
    };
  },
};

export default withRelayOptions;
