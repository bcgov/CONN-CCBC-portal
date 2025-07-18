import { GrowthBookClient } from '@growthbook/growthbook';
import config from '../../config';

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
    // eslint-disable-next-line no-console
    console.error('Failed to initialize GrowthBook:', error);
    throw error;
  }
};
