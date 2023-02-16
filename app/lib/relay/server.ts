import { Network, Environment, Store, RecordSource } from 'relay-runtime';
import config from '../../config';

const PORT = config.get('PORT');

export function createServerNetwork({ cookieHeader }: any) {
  return Network.create(async (params, variables) => {
    const response = await fetch(`http://localhost:${PORT}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        documentId: params.id,
        variables,
      }),
    });

    try {
      return response.json();
    } catch (e) {
      return console.error(e);
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
