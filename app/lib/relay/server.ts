import { Network, Environment, Store, RecordSource } from 'relay-runtime';

const ssrGraphqlUrl = () => {
  const port = process.env.PORT ?? '3000';
  return `http://127.0.0.1:${port}/graphql`;
};

export function createServerNetwork({ cookieHeader }: any) {
  return Network.create(async (params, variables) => {
    const url = ssrGraphqlUrl();
    let response: Response;
    try {
      response = await fetch(url, {
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
    } catch (e) {
      console.error('[relay-ssr] GraphQL fetch failed', {
        url,
        port: process.env.PORT ?? '(unset, using 3000)',
        error: e,
      });
      throw e;
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('[relay-ssr] GraphQL non-OK response', {
        url,
        status: response.status,
        bodyPreview: text.slice(0, 500),
      });
      return undefined;
    }

    try {
      return await response.json();
    } catch (e) {
      console.error('[relay-ssr] GraphQL response JSON parse failed', {
        url,
        status: response.status,
        error: e,
      });
      return undefined;
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
