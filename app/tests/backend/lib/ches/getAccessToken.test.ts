import getAccessToken from 'backend/lib/ches/getAccessToken';

describe('getAccessToken', () => {
  it('should return a token when the request is successful', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: 'mock_token',
            expires_in: 300,
            refresh_expires_in: 0,
            token_type: 'Bearer',
            'not-before-policy': 0,
            scope: '',
          }),
      })
    );

    const token = await getAccessToken();
    expect(token).toBe('mock_token');
  });

  it('should throw an error when the request fails', async () => {
    // Mock the fetch response
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
      })
    );

    await expect(getAccessToken()).rejects.toThrow(
      'Error getting token with status: 400'
    );
  });
});
