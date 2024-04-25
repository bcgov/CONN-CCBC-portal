import agreementSignedStatusChangeDataTeam from 'backend/lib/emails/templates/agreementSignedStatusChangeDataTeam';

describe('agreementSignedStatusChange template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = agreementSignedStatusChangeDataTeam(
      applicationId,
      url,
      {},
      { ccbcNumber: 'CCBC-101' }
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change-data-team',
        subject: 'Action Required - Upload KMZ for CCBC-101',
        body: expect.anything(),
      })
    );
  });

  it('should include correct URL in the body', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = agreementSignedStatusChangeDataTeam(
      applicationId,
      url,
      { givenName: 'uniqueStringName' },
      { ccbcNumber: 'CCBC-101' }
    );

    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project'>here</a>`
    );

    expect(emailTemplate.body).toContain('uniqueStringName');
  });
});
