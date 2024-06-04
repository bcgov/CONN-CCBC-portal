import notifyConditionallyApproved from 'backend/lib/emails/templates/notifyConditionallyApproved';

describe('notifyConditionallyApproved template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyConditionallyApproved(
      applicationId,
      url,
      {},
      { ccbcNumber: 'CCBC-101', requiredFields: ['field1', 'field2'] }
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [70],
        emailCC: [],
        tag: 'conditionally-approved-status-change',
        subject: 'Action Required - Update field1 and field2 for CCBC-101',
        body: expect.anything(),
      })
    );
  });

  it('should include correct URL in the body', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyConditionallyApproved(
      applicationId,
      url,
      { givenName: 'uniqueStringName' },
      { ccbcNumber: 'CCBC-101', requiredFields: ['field1', 'field2'] }
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project'>here</a>`
    );

    expect(emailTemplate.body).toContain('uniqueStringName');
  });
});
