import fetchMock from 'fetch-mock';
import fetchWithTimeout from '../../../lib/helpers/fetchWithTimeout';

describe('fetchWithTimeout', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should fetch successfully within timeout', async () => {
    fetchMock.get('https://test.ca', { status: 200, body: 'Success' });

    const response = await fetchWithTimeout('https://test.ca', {}, 1000);
    const text = await response.text();

    expect(response.ok).toBe(true);
    expect(text).toBe('Success');
  });

  it('should timeout if the fetch takes too long', async () => {
    fetchMock.get('https://test.ca', new Promise(() => {})); // Mock a never-resolving promise

    await expect(fetchWithTimeout('https://test.ca', {}, 10)).rejects.toThrow(
      'Fetch request to https://test.ca timed out after 10ms'
    );
  });
});
