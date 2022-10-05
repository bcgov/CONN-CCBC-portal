import {
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Store,
} from 'relay-runtime';

const API_ENDPOINT = '/graphql';

const fetchRelay = async (
  params: RequestParameters,
  variables: Record<string, object[]>
) =>
  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  }).then((response) => response.json());

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
