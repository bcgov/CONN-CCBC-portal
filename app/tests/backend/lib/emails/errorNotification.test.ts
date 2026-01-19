/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import config from '../../../../config';
import {
  reportServerError,
  sendErrorNotification,
} from '../../../../backend/lib/emails/errorNotification';
import getAccessToken from '../../../../backend/lib/ches/getAccessToken';
import sendEmail from '../../../../backend/lib/ches/sendEmail';

jest.mock('../../../../config', () => ({
  __esModule: true,
  default: {
    get: jest.fn((key: string) =>
      key === 'OPENSHIFT_APP_NAMESPACE' ? '' : ''
    ),
  },
}));
jest.mock('../../../../backend/lib/ches/getAccessToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../backend/lib/ches/sendEmail', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockConfigGet = config.get as jest.Mock;

describe('errorNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips notifications for configured sources', async () => {
    mockConfigGet.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      if (key === 'CHES_TO_EMAIL') return 'test@example.com';
      return '';
    });

    await expect(
      sendErrorNotification(new Error('boom'), { source: 'sendEmail' })
    ).resolves.toBeNull();
    expect(getAccessToken).not.toHaveBeenCalled();
  });

  it('skips notifications in test environment', async () => {
    mockConfigGet.mockImplementation((key: string) =>
      key === 'NODE_ENV' ? 'test' : 'test@example.com'
    );

    await expect(
      sendErrorNotification(new Error('boom'), { source: 'test' })
    ).resolves.toBeNull();
    expect(getAccessToken).not.toHaveBeenCalled();
  });

  it('logs and skips when CHES_TO_EMAIL is missing', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockConfigGet.mockImplementation((key: string) =>
      key === 'NODE_ENV' ? 'development' : ''
    );

    await expect(
      sendErrorNotification(new Error('boom'), { source: 'test' })
    ).resolves.toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'CHES_TO_EMAIL is not configured for error notifications.'
    );
    consoleSpy.mockRestore();
  });

  it('sends error notifications via CHES', async () => {
    mockConfigGet.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      if (key === 'CHES_TO_EMAIL') return 'test@example.com';
      return '';
    });
    mocked(getAccessToken).mockResolvedValue('token');
    mocked(sendEmail).mockResolvedValue('msg-id');

    await sendErrorNotification(new Error('boom'), { source: 'unit-test' });

    expect(sendEmail).toHaveBeenCalledWith(
      'token',
      expect.stringContaining('CCBC Portal Error'),
      expect.stringContaining('unit-test'),
      ['test@example.com'],
      'error-notification'
    );
  });

  it('normalizes error-like objects with name and stack', async () => {
    mockConfigGet.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      if (key === 'CHES_TO_EMAIL') return 'test@example.com';
      return '';
    });
    mocked(getAccessToken).mockResolvedValue('token');
    mocked(sendEmail).mockResolvedValue('msg-id');

    const errorLike = {
      name: 'CustomError',
      message: 'custom msg',
      stack: 'stacktrace',
    };

    await sendErrorNotification(errorLike, { source: 'unit-test' });

    const body = mocked(sendEmail).mock.calls[0][1];
    expect(body).toEqual(expect.stringContaining('Error Name:</strong> CustomError'));
    expect(body).toEqual(expect.stringContaining('Message:</strong> custom msg'));
    expect(body).toEqual(expect.stringContaining('<pre>stacktrace</pre>'));
  });

  it('defaults name and stack for error-like objects without them', async () => {
    mockConfigGet.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      if (key === 'CHES_TO_EMAIL') return 'test@example.com';
      return '';
    });
    mocked(getAccessToken).mockResolvedValue('token');
    mocked(sendEmail).mockResolvedValue('msg-id');

    await sendErrorNotification({ message: 'oops' }, { source: 'unit-test' });

    const body = mocked(sendEmail).mock.calls[0][1];
    expect(body).toEqual(expect.stringContaining('Error Name:</strong> Error'));
    expect(body).toEqual(expect.stringContaining('Message:</strong> oops'));
    expect(body).toEqual(
      expect.stringContaining('<p><em>No stack trace available</em></p>')
    );
  });

  it('reportServerError logs with logMessage', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockConfigGet.mockImplementation((key: string) =>
      key === 'NODE_ENV' ? 'test' : ''
    );

    reportServerError(new Error('boom'), { logMessage: 'log msg' });

    expect(consoleSpy).toHaveBeenCalledWith('log msg', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
