import reportClientError from '../../../lib/helpers/reportClientError';

describe('reportClientError', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    global.window = originalWindow;
  });

  it('posts error payload to notifyError endpoint', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    window.history.pushState({}, '', '/test');

    reportClientError(new Error('boom'), { source: 'unit-test' });

    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalledWith(
      'unit-test',
      expect.any(Error)
    );
    expect(global.fetch).toHaveBeenCalledWith('/api/email/notifyError', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String),
    });
    const body = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    );
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          name: 'Error',
          message: 'boom',
        }),
        context: { source: 'unit-test' },
        location: 'http://localhost/test',
      })
    );
    consoleSpy.mockRestore();
  });

  it('does not post when NODE_ENV is test', async () => {
    process.env.NODE_ENV = 'test';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    reportClientError(new Error('boom'), { source: 'unit-test' });
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs when notifyError fails', async () => {
    const notifyError = new Error('network');
    // @ts-ignore
    global.fetch = jest.fn().mockRejectedValue(notifyError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    reportClientError('boom', { source: 'unit-test' });
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to send error notification.',
      notifyError
    );
    consoleSpy.mockRestore();
  });
});
