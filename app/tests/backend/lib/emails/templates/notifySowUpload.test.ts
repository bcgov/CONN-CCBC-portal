import notifySowUpload from 'backend/lib/emails/templates/notifySowUpload';

describe('notifySowUpload template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifySowUpload(
      applicationId,
      url,
      {},
      { ccbcNumber: 'CCBC-101', amendmentNumber: 1 }
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [70],
        emailCC: [],
        tag: 'sow-upload-review',
        subject:
          'Action Required - Review Project Description and Project Type for CCBC-101',
        body: expect.anything(),
      })
    );
  });

  it('should include correct URL in the body for original sow upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifySowUpload(
      applicationId,
      url,
      { givenName: 'uniqueStringName' },
      { ccbcNumber: 'CCBC-101' }
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/summary'>here</a>`
    );

    expect(emailTemplate.body).toContain('uniqueStringName');
  });

  it('should include correct URL in the body for amendment sow upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifySowUpload(
      applicationId,
      url,
      { givenName: 'uniqueStringName' },
      { ccbcNumber: 'CCBC-101', amendmentNumber: 1 }
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/summary'>here</a>`
    );
    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project?section=projectInformation'>1</a>`
    );

    expect(emailTemplate.body).toContain('uniqueStringName');
  });
});
