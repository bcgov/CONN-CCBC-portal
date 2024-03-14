import getAccessToken from 'backend/lib/ches/getAccessToken';
import sendEmail from 'backend/lib/ches/sendEmail';
import agreementSignedStatusChange from 'backend/lib/emails/agreementSignedStatusChange';

jest.mock('backend/lib/ches/getAccessToken');
jest.mock('backend/lib/ches/sendEmail');

describe('agreementSignedStatusChange', () => {
  it('should call getAccessToken and sendEmail with the correct arguments', async () => {
    (getAccessToken as jest.Mock).mockResolvedValue('test_token');
    (sendEmail as jest.Mock).mockResolvedValue('email_result');

    const applicationId = '1';
    const url = 'https://mock_url.ca';
    const result = await agreementSignedStatusChange(applicationId, url);

    expect(getAccessToken).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith(
      'test_token',
      expect.stringContaining(applicationId),
      'Task assigned to you: Upload Funding Agreement',
      expect.any(String),
      'agreement-signed-status-change'
    );
    expect(result).toBe('email_result');
  });

  it('should throw an error when getAccessToken or sendEmail fails', async () => {
    (getAccessToken as jest.Mock).mockRejectedValue(new Error('test_error'));

    const applicationId = '1';
    const url = 'https://mock_url.ca';
    await expect(
      agreementSignedStatusChange(applicationId, url)
    ).rejects.toThrow('test_error');
  });
});
