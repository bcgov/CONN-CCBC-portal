/**
 * @jest-environment node
 */
import reportClientError from '../../../lib/helpers/reportClientError';

describe('reportClientError without window', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('does not post when window is unavailable', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    reportClientError('boom', { source: 'unit-test' });
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalledWith('unit-test', 'boom');
    expect(global.fetch).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
