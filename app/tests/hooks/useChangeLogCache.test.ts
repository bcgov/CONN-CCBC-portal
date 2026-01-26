import { renderHook, act, waitFor } from '@testing-library/react';
import { useChangeLogCache } from '../../hooks/useChangeLogCache';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.mock('lib/helpers/reportClientError', () => jest.fn());

describe('useChangeLogCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockFetch.mockReset();
  });

  it('should fetch data on initial load', async () => {
    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'CBC 1' }],
        allApplications: [{ id: 1, name: 'App 1' }],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ etag: 'test-etag' }),
    } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData.data);
    expect(mockFetch).toHaveBeenCalledWith('/api/change-log', { headers: {} });
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should use cached data when available and valid', async () => {
    const cachedData = {
      data: {
        allCbcs: [{ id: 1, name: 'Cached CBC' }],
        allApplications: [{ id: 1, name: 'Cached App' }],
      },
      timestamp: Date.now() - 60000, // 1 minute ago
      etag: 'cached-etag',
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedData));

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(cachedData.data);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('change_log_cache');
  });

  it('should invalidate expired cache', async () => {
    const expiredCachedData = {
      data: {
        allCbcs: [],
        allApplications: [],
      },
      timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago (expired)
      etag: 'expired-etag',
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredCachedData));

    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'Fresh CBC' }],
        allApplications: [{ id: 1, name: 'Fresh App' }],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ etag: 'fresh-etag' }),
    } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
      'change_log_cache'
    );
    expect(mockFetch).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData.data);
  });

  it('should handle 304 Not Modified response', async () => {
    const cachedData = {
      data: {
        allCbcs: [{ id: 1, name: 'Cached CBC' }],
        allApplications: [{ id: 1, name: 'Cached App' }],
      },
      timestamp: Date.now() - 60000, // 1 minute ago
      etag: 'unchanged-etag',
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedData));

    // Mock 304 response
    mockFetch.mockResolvedValueOnce({
      status: 304,
      ok: false,
    } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(cachedData.data);
  });

  it('should handle fetch errors and use stale cache', async () => {
    const staleData = {
      data: {
        allCbcs: [{ id: 1, name: 'Stale CBC' }],
        allApplications: [{ id: 1, name: 'Stale App' }],
      },
      timestamp: Date.now() - 10 * 60 * 1000, // Expired but available
      etag: 'stale-etag',
    };

    // Setup localStorage to return stale data consistently
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(staleData));

    // Mock fetch to always fail
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 8000 }
    );

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toEqual(staleData.data);
  }, 10000);

  it('should clear cache when clearCache is called', async () => {
    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'CBC 1' }],
        allApplications: [{ id: 1, name: 'App 1' }],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ etag: 'test-etag' }),
    } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.clearCache();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
      'change_log_cache'
    );
    expect(result.current.data).toEqual({ allCbcs: [], allApplications: [] });
  });

  it('should handle malformed cache data gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');

    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'CBC 1' }],
        allApplications: [{ id: 1, name: 'App 1' }],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ etag: 'test-etag' }),
    } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
      'change_log_cache'
    );
    expect(result.current.data).toEqual(mockData.data);
  });
});
