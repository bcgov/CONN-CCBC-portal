import { useState, useEffect, useCallback } from 'react';
import reportClientError from 'lib/helpers/reportClientError';

interface ChangeLogData {
  allCbcs: any[];
  allApplications: any[];
}

interface ChangeLogResponse {
  data: ChangeLogData;
  updatedAt?: string | null;
}

interface ChangeLogRefreshResponse {
  hasUpdates?: boolean;
  updatedAt?: string | null;
}

const useChangeLogCache = () => {
  const [data, setData] = useState<ChangeLogData>({
    allCbcs: [],
    allApplications: [],
  });
  const [cacheUpdatedAt, setCacheUpdatedAt] = useState<string | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshInBackground = useCallback(async () => {
    try {
      const response = await fetch('/api/change-log/refresh');
      if (!response.ok) return;

      const result: ChangeLogRefreshResponse = await response.json();
      if (result?.hasUpdates) {
        setHasUpdates(true);
        return;
      }

      if (result?.updatedAt) {
        setCacheUpdatedAt(result.updatedAt);
      }
    } catch (err) {
      // ignore background refresh errors
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/change-log');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChangeLogResponse = await response.json();
      setData(result.data);
      setCacheUpdatedAt(result.updatedAt ?? null);
      setHasUpdates(false);

      void refreshInBackground();
    } catch (err) {
      const fetchError =
        err instanceof Error ? err : new Error('Unknown error occurred');

      setError(fetchError);

      if (process.env.NODE_ENV === 'production') {
        reportClientError(fetchError, {
          source: 'change-log-cache',
          metadata: { message: fetchError.message },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshInBackground]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    cacheUpdatedAt,
    hasUpdates,
  };
};

export { useChangeLogCache };

export default useChangeLogCache;
