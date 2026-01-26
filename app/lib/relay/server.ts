import { Network, Environment, Store, RecordSource } from 'relay-runtime';
import getConfig from 'next/config';

const {
  serverRuntimeConfig: { PORT },
} = getConfig();

export function createServerNetwork({ cookieHeader }: any) {
  return Network.create(async (params, variables) => {
    const response = await fetch(`http://localhost:3000/graphql`, {
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
