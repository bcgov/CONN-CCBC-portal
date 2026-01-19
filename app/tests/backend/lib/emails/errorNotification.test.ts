/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import config from '../../../../config';
import * as errorNotificationModule from '../../../../backend/lib/emails/errorNotification';
import {
  reportServerError,
  sendErrorNotification,
} from '../../../../backend/lib/emails/errorNotification';
import getAccessToken from '../../../../backend/lib/ches/getAccessToken';
import sendEmail from '../../../../backend/lib/ches/sendEmail';

jest.mock('../../../../config');
jest.mock('../../../../backend/lib/ches/getAccessToken');
jest.mock('../../../../backend/lib/ches/sendEmail');

describe('errorNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips notifications for configured sources', async () => {
    mocked(config.get).mockImplementation((key: string) => {
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
    mocked(config.get).mockImplementation((key: string) =>
      key === 'NODE_ENV' ? 'test' : 'test@example.com'
    );

    await expect(
      sendErrorNotification(new Error('boom'), { source: 'test' })
    ).resolves.toBeNull();
    expect(getAccessToken).not.toHaveBeenCalled();
  });

  it('logs and skips when CHES_TO_EMAIL is missing', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mocked(config.get).mockImplementation((key: string) =>
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
    mocked(config.get).mockImplementation((key: string) => {
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
    const sendSpy = jest
      .spyOn(errorNotificationModule, 'sendErrorNotification')
      .mockResolvedValue(null);

    reportServerError(new Error('boom'), { logMessage: 'log msg' });

    expect(consoleSpy).toHaveBeenCalledWith('log msg', expect.any(Error));
    expect(sendSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    sendSpy.mockRestore();
  });
});
