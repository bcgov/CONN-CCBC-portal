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
        subject: 'Claim & Progress Report uploaded',
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
      `<li><em>template_1.xls</em> (Template 1, Template 2 and Template 9)</li>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>template_2.xls</em> (Template 1, Template 2 and Template 9)</li>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>template_9.xls</em> (Template 1, Template 2 and Template 9)</li>`
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
      `<li><em>document.pdf</em> (Email Correspondence)</li>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>report.docx</em> (Email Correspondence)</li>`
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

    expect(emailTemplate.subject).toBe('Email Correspondence uploaded');
    expect(emailTemplate.body).toContain(
      `<a href='http://mock_host.ca/analyst/application/1/rfi'>CCBC-10001</a>`
    );
    expect(emailTemplate.body).toContain(
      `<li><em>email_file.pdf</em> (Email Correspondence)</li>`
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

    expect(emailTemplate.body).toContain(`<li><em>file1.pdf</em> (Email Correspondence)</li>`);
    expect(emailTemplate.body).toContain(`<li><em>file2.docx</em> (Email Correspondence)</li>`);
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

    expect(emailTemplate.body).toContain('Email Correspondence created');
    expect(emailTemplate.body).toContain('CCBC-1000');
    expect(emailTemplate.body).not.toContain('<ul>');
  });

  // Tests for RFI Additional Documents functionality
  describe('RFI Additional Documents with requestedFiles', () => {
    it('should display requested additional files when provided', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Template 2 - Detailed Budget',
            'Financial statements',
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.subject).toBe('RFI Additional Documents created');
      expect(emailTemplate.body).toContain('<h3>Requested Additional Documents:</h3>');
      expect(emailTemplate.body).toContain('<li><strong>Template 1 - Eligibility and Impacts Calculator</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Template 2 - Detailed Budget</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Financial statements</strong></li>');
    });

    it('should link to RFI page for RFI Additional Documents type', () => {
      const applicationId = '123';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          requestedFiles: ['Template 1 - Eligibility and Impacts Calculator'],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.body).toContain(
        `<a href='http://mock_host.ca/analyst/application/123/rfi'>CCBC-10001</a>`
      );
    });

    it('should display both uploaded files and requested documents when both are provided', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          documentNames: ['response_letter.pdf'],
          fileDetails: [
            {
              name: 'response_letter.pdf',
              type: 'application/pdf',
              uploadedAt: '2024/08/24 11:00:00',
            },
          ],
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Template 3 - Financial Forecast',
            'Project schedule',
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      // Check uploaded files section
      expect(emailTemplate.body).toContain('<h3>Uploaded Files (RFI Additional Documents):</h3>');
      expect(emailTemplate.body).toContain('<li><em>response_letter.pdf</em> (RFI Additional Documents)</li>');

      // Check requested documents section
      expect(emailTemplate.body).toContain('<h3>Requested Additional Documents:</h3>');
      expect(emailTemplate.body).toContain('<li><strong>Template 1 - Eligibility and Impacts Calculator</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Template 3 - Financial Forecast</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Project schedule</strong></li>');
    });

    it('should handle only uploaded files without requested documents', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          documentNames: ['file1.pdf', 'file2.docx'],
          fileDetails: [
            {
              name: 'file1.pdf',
              type: 'application/pdf',
              uploadedAt: '2024/08/24 11:00:00',
            },
            {
              name: 'file2.docx',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              uploadedAt: '2024/08/24 11:05:00',
            },
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.body).toContain('<h3>Multiple files uploaded for CCBC-10001:</h3>');
      expect(emailTemplate.body).not.toContain('<h3>Requested Additional Documents:</h3>');
    });

    it('should handle only requested documents without uploaded files', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Logical Network Diagram',
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.body).not.toContain('<h3>Uploaded Files:</h3>');
      expect(emailTemplate.body).toContain('<h3>Requested Additional Documents:</h3>');
    });

    it('should handle empty requestedFiles array', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          requestedFiles: [],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.body).not.toContain('<h3>Requested Additional Documents:</h3>');
    });

    it('should handle all 20 document types in requestedFiles', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Template 2 - Detailed Budget',
            'Template 3 - Financial Forecast',
            'Template 4 - Last Mile Internet Service Offering',
            'Template 5 - List of Points of Presence and Wholesale Pricing',
            'Template 6 - Community and Rural Development Benefits',
            'Template 7 - Wireless Addendum',
            'Template 8 - Supporting Connectivity Evidence',
            'Template 9 - Backbone and Geographic Names',
            'Template 10 - Equipment Details',
            'Copies of registration and other relevant documents',
            'Financial statements',
            'Logical Network Diagram',
            'Project schedule',
            'Benefits supporting documents',
            'Other supporting materials',
            'Coverage map from Eligibility Mapping Tool',
            'Coverage Assessment and Statistics',
            'Current network infrastructure',
            'Proposed or Upgraded Network Infrastructure',
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      expect(emailTemplate.body).toContain('<h3>Requested Additional Documents:</h3>');
      expect(emailTemplate.body).toContain('<li><strong>Template 1 - Eligibility and Impacts Calculator</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Template 10 - Equipment Details</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Financial statements</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Proposed or Upgraded Network Infrastructure</strong></li>');
    });

    it('should display multiple uploaded files and multiple requested documents correctly', () => {
      const applicationId = '1';
      const url = 'http://mock_host.ca';

      const emailTemplate: any = notifyDocumentUpload(
        applicationId,
        url,
        {},
        {
          ccbcNumber: 'CCBC-10001',
          documentType: 'RFI Additional Documents',
          documentNames: ['email1.pdf', 'email2.docx', 'email3.xlsx'],
          fileDetails: [
            {
              name: 'email1.pdf',
              type: 'application/pdf',
              uploadedAt: '2024/08/24 11:00:00',
            },
            {
              name: 'email2.docx',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              uploadedAt: '2024/08/24 11:01:00',
            },
            {
              name: 'email3.xlsx',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              uploadedAt: '2024/08/24 11:02:00',
            },
          ],
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Template 2 - Detailed Budget',
            'Financial statements',
            'Logical Network Diagram',
            'Project schedule',
          ],
          timestamp: '2024/08/24 11:00:00',
        }
      );

      // Verify uploaded files section has all 3 files
      expect(emailTemplate.body).toContain('<h3>Multiple files uploaded for CCBC-10001:</h3>');
      expect(emailTemplate.body).toContain('<li><em>email1.pdf</em>');
      expect(emailTemplate.body).toContain('<li><em>email2.docx</em>');
      expect(emailTemplate.body).toContain('<li><em>email3.xlsx</em>');

      // Verify requested documents section has all 5 documents
      expect(emailTemplate.body).toContain('<h3>Requested Additional Documents:</h3>');
      expect(emailTemplate.body).toContain('<li><strong>Template 1 - Eligibility and Impacts Calculator</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Template 2 - Detailed Budget</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Financial statements</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Logical Network Diagram</strong></li>');
      expect(emailTemplate.body).toContain('<li><strong>Project schedule</strong></li>');
    });
  });
});
