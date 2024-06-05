import rfiCoverageMapKmzUploaded from 'backend/lib/emails/templates/rfiCoverageMapKmzUploaded';

const defaultParams = {
  applicationId: '1',
  host: 'http://localhost:3000',
  ccbcNumber: 'CCBC-010040',
  rfiFormData: {
    rfiType: ['Technical'],
    rfiAdditionalFiles: {
      geographicCoverageMap: {},
      geographicCoverageMapRfi: true,
    },
    rfiDueBy: '2024-06-26',
  },
  rfiNumber: 'CCBC-010040-8',
  changes: [
    {
      id: 1937,
      uuid: 'e723c93c-e656-45c9-9a5c-39ab8d4ab6e5',
      name: '1.kmz',
      size: 0,
      type: '',
      uploadedAt: '2024-05-31T14:05:03.509-07:00',
    },
  ],
};

const sanitizeBody = (str: string) => str.replace(/\s+/g, '');

describe('rfiCoverageMapKmzUploaded email template', () => {
  it('should generate correct email template for manual update', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = rfiCoverageMapKmzUploaded(
      applicationId,
      url,
      { givenName: 'CCBC USER' },
      {
        ...defaultParams,
        manualUpdate: true,
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77, 34, 72],
        emailCC: [],
        tag: 'rfi-coverage-map-kmz-uploaded',
        subject: 'Notification - A KMZ was uploaded to CCBC-010040',
        body: sanitizeBody(`
        <h1>KMZ file uploaded for RFI CCBC-010040-8</h1>
        <p>CCBC USER has uploaded the following KMZ(s):</p>
        <ul>
          <li>1.kmz uploaded on 2024-05-31T14:05:03.509-07:00</li>
        </ul>
        <p>This <a href='http://mock_host.ca/analyst/application/1/rfi'>RFI</a> closes/closed on 2024-06-26<p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate email template for upload update for analyst RFI upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = rfiCoverageMapKmzUploaded(
      applicationId,
      url,
      { givenName: 'CCBC ANALYST' },
      {
        ...defaultParams,
        changes: [{ ...defaultParams.changes[0], fileDate: '2024-05-31' }],
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77, 34, 72],
        emailCC: [],
        tag: 'rfi-coverage-map-kmz-uploaded',
        subject: 'Notification - A KMZ was uploaded to CCBC-010040',
        body: sanitizeBody(`
        <h1>KMZ file uploaded for RFI CCBC-010040-8</h1>
        <p>CCBC ANALYST has uploaded the following KMZ(s):</p>
        <ul>
          <li>1.kmz received on 2024-05-31</li>
        </ul>
        <p>This <a href='http://mock_host.ca/analyst/application/1/rfi'>RFI</a> closes/closed on 2024-06-26<p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate email template for upload update for applicant RFI upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = rfiCoverageMapKmzUploaded(
      applicationId,
      url,
      { givenName: 'CCBC APPLICANT' },
      {
        ...defaultParams,
        organizationName: 'CCBC ORG',
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77, 34, 72],
        emailCC: [],
        tag: 'rfi-coverage-map-kmz-uploaded',
        subject: 'Notification - A KMZ was uploaded to CCBC-010040',
        body: sanitizeBody(`
        <h1>KMZ file uploaded for RFI CCBC-010040-8</h1>
        <p>CCBC ORG has uploaded the following KMZ(s):</p>
        <ul>
          <li>1.kmz uploaded on 2024-05-31T14:05:03.509-07:00</li>
        </ul>
        <p>This <a href='http://mock_host.ca/analyst/application/1/rfi'>RFI</a> closes/closed on 2024-06-26<p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });
});
