import notifyDocumentUpload from 'backend/lib/emails/templates/notifyDocumentUpload';

describe('notifyDocumentUpload template', () => {
  it('should return an email template with correct properties', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-101',
        documentType: 'Claim & Progress Report',
        documentNames: ['sow.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [112, 10, 111],
        emailCC: [],
        tag: 'document-upload-notification',
        subject: 'Claim & Progress Report uploaded in Portal',
        body: expect.anything(),
      })
    );
  });

  it('should generates the correct body and subject based on the document type provided', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplateClaims: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Claim & Progress Report',
        documentNames: ['sow.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );
    expect(emailTemplateClaims.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project?section=claimsReport'>CCBC-10001</a>`
    );

    const emailTemplateMilestone: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Milestone Report',
        documentNames: ['milestone.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );
    expect(emailTemplateMilestone.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project?section=milestoneReport'>CCBC-10001</a>`
    );

    const emailTemplateCommunityProgress: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Community Progress Report',
        documentNames: ['communityProgress.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );
    expect(emailTemplateCommunityProgress.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project?section=communityProgressReport'>CCBC-10001</a>`
    );

    const emailTemplateCommunitySOW: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Statement of Work',
        documentNames: ['sow.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );
    expect(emailTemplateCommunitySOW.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/project?section=projectInformation'>CCBC-10001</a>`
    );
  });

  it('should contain the correct list of filenames', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Template 1, Template 2 and Template 9',
        documentNames: ['template_1.xls', 'template_2.xls', 'template_9.xls'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );
    expect(emailTemplate.body).toContain(
      `<li><em>template_1.xls</em></li><li><em>template_2.xls</em></li><li><em>template_9.xls</em></li>`
    );
  });
});
