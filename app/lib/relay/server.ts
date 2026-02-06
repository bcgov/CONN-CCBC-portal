import { Network, Environment, Store, RecordSource } from 'relay-runtime';
import getConfig from 'next/config';
import { logConnection } from '../helpers/connectionLogger';

const {
  serverRuntimeConfig: { PORT },
} = getConfig();

export function createServerNetwork({ cookieHeader }: any) {
  return Network.create(async (params, variables) => {
    const url = 'http://localhost:3000/graphql';
    logConnection('ssr.graphql.request', {
      url,
      method: 'POST',
      service: 'relay-ssr',
    });
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        id: params.id,
        variables,
      }),
    });

    try {
      logConnection('ssr.graphql.response', {
        url,
        method: 'POST',
        service: 'relay-ssr',
        status: response.status,
      });
      return await response.json();
    } catch (e) {
      // Server-side relay fetch failures should not pull backend-only deps into client bundles.
      console.error(e);
    }
  });
}

export function createServerEnvironment(serverSideProps: any) {
  return new Environment({
    network: createServerNetwork(serverSideProps),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
