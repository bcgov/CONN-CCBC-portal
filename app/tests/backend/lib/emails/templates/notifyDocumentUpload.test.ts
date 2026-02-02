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

  it('should include file type information when fileDetails are provided', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Email Correspondence',
        documentNames: ['document.pdf', 'report.docx'],
        fileDetails: [
          {
            name: 'document.pdf',
            type: 'application/pdf',
            uploadedAt: '2024/08/24 11:00:00',
          },
          {
            name: 'report.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadedAt: '2024/08/24 11:05:00',
          },
        ],
        timeStamp: '2024/08/24 11:00:00',
      }
    );

    expect(emailTemplate.body).toContain(
      `<li><em>document.pdf</em> <strong>(Type: application/pdf)</strong></li>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>report.docx</em> <strong>(Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document)</strong></li>`
    );
  });

  it('should handle Email Correspondence document type with correct RFI link', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Email Correspondence',
        documentNames: ['email_file.pdf'],
        fileDetails: [
          {
            name: 'email_file.pdf',
            type: 'application/pdf',
            uploadedAt: '2024/08/24 11:00:00',
          },
        ],
        timeStamp: '2024/08/24 11:00:00',
      }
    );

    expect(emailTemplate.subject).toBe('Email Correspondence uploaded in Portal');
    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/rfi'>CCBC-10001</a>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>email_file.pdf</em> <strong>(Type: application/pdf)</strong></li>`
    );
  });

  it('should fall back to documentNames when fileDetails are not provided', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Email Correspondence',
        documentNames: ['file1.pdf', 'file2.docx'],
        timeStamp: '2024/08/24 11:00:00',
      }
    );

    // Should not include type information
    expect(emailTemplate.body).toContain(`<li><em>file1.pdf</em></li>`);
    expect(emailTemplate.body).toContain(`<li><em>file2.docx</em></li>`);
    expect(emailTemplate.body).not.toContain('Type:');
  });

  it('should handle empty fileDetails array gracefully', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = notifyDocumentUpload(
      applicationId,
      url,
      {},
      {
        ccbcNumber: 'CCBC-10001',
        documentType: 'Email Correspondence',
        documentNames: [],
        fileDetails: [],
        timeStamp: '2024/08/24 11:00:00',
      }
    );

    expect(emailTemplate.body).toContain('Email Correspondence uploaded in Portal');
    expect(emailTemplate.body).toContain('<ul>');
  });
});
