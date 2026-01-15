import reportClientError from './reportClientError';

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  // default timeout is the equivalent of the max
  // liveness of a pod in OpenShift + 15 seconds
  timeout: number = 105000
): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  const fetchOptions = { ...options, signal };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    reportClientError(error, { source: 'fetch-with-timeout', metadata: { url } });
    if (error.name === 'AbortError') {
      throw new Error(`Fetch request to ${url} timed out after ${timeout}ms`);
    }
    throw error;
  }
};

export default fetchWithTimeout;
