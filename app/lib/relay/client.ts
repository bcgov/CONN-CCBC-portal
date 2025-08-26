import { Environment, RecordSource, Store } from 'relay-runtime';
import {
  RelayNetworkLayer,
  urlMiddleware,
  batchMiddleware,
  cacheMiddleware,
  uploadMiddleware,
} from 'react-relay-network-modern';
import debounceMutationMiddleware from './debounceMutationMiddleware';

const oneMinute = 60 * 1000;

export function createClientNetwork() {
  const network = new RelayNetworkLayer([
    cacheMiddleware({
      size: 100, // Max 100 requests
      // Number in milliseconds, how long records stay valid in cache (default: 900000, 15 minutes).
      // Is one minute enough? How long should records stay valid?
      ttl: oneMinute,
    }),
    urlMiddleware({
      url: async () => Promise.resolve('/graphql'),
    }),
    debounceMutationMiddleware(500),
    uploadMiddleware(),
    batchMiddleware({
      batchUrl: async () => Promise.resolve('/graphql'),
      batchTimeout: 10,
      allowMutations: false,
    }),
  ]);

  return network;
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    try {
      clientEnv = new Environment({
        network: createClientNetwork(),
        store: new Store(new RecordSource()),
        isServer: false,
      });
    } catch (error) {
      // Log the error silently and return null to prevent crashes
      if (typeof window !== 'undefined' && window.console) {
        // eslint-disable-next-line no-console
        console.error('Failed to create Relay client environment:', error);
      }
      return null;
    }
  }

  return clientEnv;
}
