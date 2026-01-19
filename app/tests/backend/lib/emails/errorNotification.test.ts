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
