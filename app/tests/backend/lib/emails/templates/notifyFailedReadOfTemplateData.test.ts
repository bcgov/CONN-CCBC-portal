import notifyFailedReadOfTemplateData from 'backend/lib/emails/templates/notifyFailedReadOfTemplateData';

describe('notifyApplicationSubmission template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyFailedReadOfTemplateData(
      applicationId,
      url,
      {},
      { templateNumber: 1 }
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [111, 112, 113, 114, 115],
        emailCC: [],
        tag: 'failed-read-of-template-data',
        subject: 'Template 1 - Failed Response',
        body: expect.anything(),
      })
    );
  });

  it('should format parameters in body', () => {
    const applicationId = '321';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyFailedReadOfTemplateData(
      applicationId,
      url,
      {},
      { uuid: '123', templateNumber: 1, uploadedAt: 'asdf' }
    );

    expect(emailTemplate.body).toContain(`Environment: Dev`);
    expect(emailTemplate.body).toContain(`Application ID: 321`);
    expect(emailTemplate.body).toContain(`File UUID: 123`);
    expect(emailTemplate.body).toContain(`Template Number: 1`);
    expect(emailTemplate.body).toContain(`a failed response at asdf`);
  });
});
