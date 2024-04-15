import { mocked } from 'jest-mock';
import getAuthRole from 'utils/getAuthRole';
import {
  handleEmailNotification,
  getEmailRecipients,
} from 'backend/lib/emails/handleEmailNotification';
import getAuthUser from 'utils/getAuthUser';
import sendEmail from 'backend/lib/ches/sendEmail';
import agreementSignedStatusChange from 'backend/lib/emails/templates/agreementSignedStatusChange';
import getAccessToken from 'backend/lib/ches/getAccessToken';
import getConfig from 'next/config';
import config from '../../../../config';
import { performQuery } from '../../../../backend/lib/graphql';

jest.mock('utils/getAuthRole');
jest.mock('utils/getAuthUser');
jest.mock('backend/lib/ches/sendEmail');
jest.mock('backend/lib/ches/getAccessToken');
jest.mock('backend/lib/emails/templates/agreementSignedStatusChange');
jest.mock('../../../../config');
jest.mock('next/config');

jest.mock('../../../../backend/lib/graphql', () => ({
  performQuery: jest.fn(),
}));

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
      return { givenName: 'CCBC User', familyName: 'CCBC Portal' };
    });

    mocked(agreementSignedStatusChange).mockReturnValue({
      emailTo: [],
      emailCC: [],
      tag: 'test-tag',
      subject: 'Mock Subject',
      body: 'Mock email body',
    });

    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        CHES_TO_EMAIL: 'test@mail.com',
      };
      return mockConfig[name] as any;
    });

    mocked(getConfig).mockReturnValue({
      publicRuntimeConfig: {
        OPENSHIFT_APP_NAMESPACE: 'environment-dev',
      },
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
      { familyName: 'CCBC Portal', givenName: 'CCBC User' },
      { ccbcNumber: 'ABC' }
    );

    expect(sendEmail).toHaveBeenCalledWith(
      'test_token',
      'Mock email body',
      'Mock Subject',
      ['test@mail.com'],
      'test-tag',
      ['test@mail.com']
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

  it('should return default email if in a non-prod environment', async () => {
    const emailRecipient = await getEmailRecipients([1], req);

    expect(emailRecipient).toEqual(['test@mail.com']);
  });

  it('should return analyst email if in a prod environment', async () => {
    mocked(getConfig).mockReturnValue({
      publicRuntimeConfig: {
        OPENSHIFT_APP_NAMESPACE: 'environment-prod',
      },
    });
    mocked(performQuery).mockResolvedValueOnce({
      data: {
        allAnalysts: { edges: [{ node: { email: 'test_analyst@mail.com' } }] },
      },
    });
    const emailRecipient = await getEmailRecipients([1], req);

    expect(emailRecipient).toEqual(['test_analyst@mail.com']);
  });
});
