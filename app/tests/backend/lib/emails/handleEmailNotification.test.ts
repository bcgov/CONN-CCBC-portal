import { mocked } from 'jest-mock';
import getAuthRole from 'utils/getAuthRole';
import handleEmailNotification from 'backend/lib/emails/handleEmailNotification';
import getAuthUser from 'utils/getAuthUser';
import sendEmail from 'backend/lib/ches/sendEmail';
import agreementSignedStatusChange from 'backend/lib/emails/templates/agreementSignedStatusChange';
import getAccessToken from 'backend/lib/ches/getAccessToken';

jest.mock('utils/getAuthRole');
jest.mock('utils/getAuthUser');
jest.mock('backend/lib/ches/sendEmail');
jest.mock('backend/lib/ches/getAccessToken');
jest.mock('backend/lib/emails/templates/agreementSignedStatusChange');

const req = {
  body: { applicationId: '1', host: 'http://mock_host.ca' },
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  end: jest.fn(),
};

describe('The Email', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mocked(getAccessToken).mockResolvedValue('test_token');
    mocked(getAuthRole).mockReturnValue({
      pgRole: 'ccbc_admin',
      landingRoute: '/',
    });
    mocked(getAuthUser).mockImplementation(() => {
      return 'CCBC User';
    });

    mocked(agreementSignedStatusChange).mockReturnValue({
      emailTo: ['test_to@gov.mail.ca'],
      emailCC: ['test_cc@gov.mail.ca'],
      tag: 'test-tag',
      subject: 'Mock Subject',
      body: 'Mock email body',
    });
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });
    await handleEmailNotification(req, res, jest.fn(), {});

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should call getAccessToken and sendEmail with the correct arguments', async () => {
    mocked(sendEmail).mockImplementation(async () => {
      return 'mock_message_id';
    });
    await handleEmailNotification(req, res, agreementSignedStatusChange, {
      ccbcNumber: 'ABC',
    });

    expect(getAccessToken).toHaveBeenCalled();

    expect(agreementSignedStatusChange).toHaveBeenCalledWith(
      '1',
      'http://mock_host.ca',
      'CCBC User',
      { ccbcNumber: 'ABC' }
    );

    expect(sendEmail).toHaveBeenCalledWith(
      'test_token',
      'Mock email body',
      'Mock Subject',
      ['test_to@gov.mail.ca'],
      'test-tag',
      ['test_cc@gov.mail.ca']
    );
  });

  it('should return 200 when email sent successfully', async () => {
    mocked(sendEmail).mockImplementation(async () => {
      return 'mock_message_id';
    });
    await handleEmailNotification(req, res, agreementSignedStatusChange);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should throw an error when getAccessToken fails', async () => {
    mocked(getAccessToken).mockRejectedValueOnce(async () => {
      return new Error('Test Error');
    });
    await handleEmailNotification(req, res, agreementSignedStatusChange, {});

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should return correct error when email sending fails', async () => {
    mocked(sendEmail).mockRejectedValueOnce(async () => {
      return new Error('Email sending failed');
    });
    await handleEmailNotification(req, res, agreementSignedStatusChange, {});

    expect(res.status).toHaveBeenCalledWith(500);

    mocked(sendEmail).mockImplementationOnce(async () => {
      return null;
    });
    await handleEmailNotification(req, res, agreementSignedStatusChange, {});

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
