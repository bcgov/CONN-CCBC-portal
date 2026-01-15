import { GrowthBookClient } from '@growthbook/growthbook';
import config from '../../config';
import { reportServerError } from './emails/errorNotification';

// Initialize GrowthBook client
export const gbClient = new GrowthBookClient({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: config.get('NEXT_PUBLIC_GROWTHBOOK_API_KEY'),
});

// Initialize the GrowthBook client (async)
export const initializeGrowthBook = async () => {
  try {
    await gbClient.init({ timeout: 3000 });
    return gbClient;
  } catch (error) {
    reportServerError(error, { source: 'growthbook-init' });
    throw error;
  }
};
