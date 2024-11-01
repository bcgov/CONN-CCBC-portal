import notifyApplicationSubmission from 'backend/lib/emails/templates/notifyApplicationSubmission';

describe('notifyApplicationSubmission template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyApplicationSubmission(
      applicationId,
      url,
      {},
      {}
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [71, 34, 70, 1, 3, 72, 111, 112, 10, 11, 146, 77],
        emailCC: [],
        tag: 'application-submitted',
        subject: 'CCBC Application received',
        body: expect.anything(),
      })
    );
  });

  it('should include correct URL in the body', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyApplicationSubmission(
      applicationId,
      url,
      {},
      {}
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1'>here</a>`
    );
  });
});
