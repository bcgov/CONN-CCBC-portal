import { renderHook, waitFor } from '@testing-library/react';
import { useChangeLogCache } from '../../hooks/useChangeLogCache';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

jest.mock('lib/helpers/reportClientError', () => jest.fn());

describe('useChangeLogCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should fetch data on initial load and refresh in background', async () => {
    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'CBC 1' }],
        allApplications: [{ id: 1, name: 'App 1' }],
      },
      updatedAt: '2026-02-04T18:00:00.000Z',
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ hasUpdates: false }),
      } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.cacheUpdatedAt).toBe(mockData.updatedAt);
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/change-log');
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/change-log/refresh');
  });

  it('should set hasUpdates when background refresh detects changes', async () => {
    const mockData = {
      data: {
        allCbcs: [{ id: 1, name: 'CBC 1' }],
        allApplications: [{ id: 1, name: 'App 1' }],
      },
      updatedAt: '2026-02-04T18:00:00.000Z',
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ hasUpdates: true }),
      } as Response);

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.hasUpdates).toBe(true);
    });
  });

  it('should capture fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChangeLogCache());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});
