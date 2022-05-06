import {
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Store,
} from 'relay-runtime';

const API_ENDPOINT = 'http://localhost:5000/graphql';

const fetchRelay = async (
  params: RequestParameters,
  variables: Record<string, object[]>
) => {
  return fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
