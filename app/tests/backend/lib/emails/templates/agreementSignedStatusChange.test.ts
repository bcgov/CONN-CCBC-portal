import agreementSignedStatusChange from 'backend/lib/emails/templates/agreementSignedStatusChange';

describe('agreementSignedStatusChange template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = agreementSignedStatusChange(applicationId, url);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject: 'Task assigned to you: Upload Funding Agreement',
      })
    );
  });

  it('should include correct URL in the body', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = agreementSignedStatusChange(applicationId, url);

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project'>click here</a>`
    );
  });
});
