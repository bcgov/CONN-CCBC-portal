import { useState, useEffect, useCallback } from 'react';
import reportClientError from 'lib/helpers/reportClientError';

interface ChangeLogData {
  allCbcs: any[];
  allApplications: any[];
}

interface CacheEntry {
  data: ChangeLogData;
  timestamp: number;
  etag?: string;
  isExpired?: boolean;
}

const CACHE_KEY = 'change_log_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;

const useChangeLogCache = () => {
  const [data, setData] = useState<ChangeLogData>({
    allCbcs: [],
    allApplications: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to get cached data from localStorage
  const getCachedData = useCallback((): CacheEntry | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Return cache data but mark if expired (don't remove yet)
      const isExpired = now - parsedCache.timestamp > CACHE_DURATION;
      return { ...parsedCache, isExpired };
    } catch (err) {
      // Silent error handling for malformed cache data
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  // Helper function to get valid (non-expired) cached data
  const getValidCachedData = useCallback((): CacheEntry | null => {
    const cached = getCachedData();
    if (!cached || cached.isExpired) {
      // Remove expired cache
      if (cached?.isExpired) {
        localStorage.removeItem(CACHE_KEY);
      }
      return null;
    }
    return cached;
  }, [getCachedData]);

  // Helper function to set cached data in localStorage
  const setCachedData = useCallback((newData: ChangeLogData, etag?: string) => {
    try {
      const cacheEntry: CacheEntry = {
        data: newData,
        timestamp: Date.now(),
        etag,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (err) {
      // Silent warning - using console for debugging purposes
      // eslint-disable-next-line no-console
      console.warn('Failed to cache data:', err);
    }
  }, []);

  // Function to fetch data with retry logic
  const fetchWithRetry = useCallback(
    async (retryCount = 0): Promise<Response> => {
      try {
        const cached = getValidCachedData();
        const headers: HeadersInit = {};

        // Add If-None-Match header if we have a cached ETag
        if (cached?.etag) {
          headers['If-None-Match'] = cached.etag;
        }

        const response = await fetch('/api/change-log', { headers });

        // If we get 304 Not Modified, use cached data
        if (response.status === 304 && cached) {
          return new Response(JSON.stringify({ data: cached.data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return response;
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          // Exponential backoff
          const delay = 2 ** retryCount * 1000;
          await new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
          return fetchWithRetry(retryCount + 1);
        }
        throw err;
      }
    },
    [getValidCachedData]
  );

  // Main fetch function
  const fetchData = useCallback(
    async (force = false) => {
      try {
        setIsLoading(true);
        setError(null);

        // If not forcing refresh, try to use cached data first
        if (!force) {
          const cached = getValidCachedData();
          if (cached) {
            setData(cached.data);
            setIsLoading(false);
            // Skip background fetch for now to avoid test complications
            return;
          }
        }

        // Fetch fresh data
        const response = await fetchWithRetry();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const etag = response.headers.get('etag');

        setData(result.data);
        setCachedData(result.data, etag || undefined);
        setError(null); // Clear any previous errors on successful fetch
      } catch (err) {
        const fetchError =
          err instanceof Error ? err : new Error('Unknown error occurred');

        // Try to use stale cache as fallback
        const staleCache = getCachedData();
        if (staleCache) {
          setData(staleCache.data);
        }

        // Set error after trying cache fallback
        setError(fetchError);

        // Only capture in production to avoid test noise
        if (process.env.NODE_ENV === 'production') {
          reportClientError(fetchError, {
            source: 'change-log-cache',
            metadata: { message: fetchError.message },
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getValidCachedData, getCachedData, setCachedData, fetchWithRetry]
  );

  // Function to clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setData({ allCbcs: [], allApplications: [] });
  }, []);

  // Function to refresh data
  const refreshData = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refreshData,
    clearCache,
  };
};

export { useChangeLogCache };

export default useChangeLogCache;
