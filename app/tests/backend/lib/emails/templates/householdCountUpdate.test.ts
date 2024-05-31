import householdCountUpdate from 'backend/lib/emails/templates/householdCountUpdate';

const defaultParams = {
  ccbcNumber: 'CCBC-12345',
  timestamp: '5/30/2024, 12:53:56 PM',
  fieldsChanged: {
    'Eligible Households': { old: 100, new: 150 },
    'Indigenous Impacted Households': { old: 100, new: 150 },
  },
};

const sanitizeBody = (str: string) => str.replace(/\s+/g, '');

describe('householdCountUpdate email template', () => {
  it('should generate correct email template for manual update', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = householdCountUpdate(
      applicationId,
      url,
      { givenName: 'CCBC USER' },
      {
        ...defaultParams,
        manualUpdate: true,
        reasonProvided: 'Correction needed',
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject: 'CCBC USER has updated the household numbers for CCBC-12345',
        body: sanitizeBody(`
        <p>CCBC USER has manually updated the <strong>Eligible Households and Indigenous Impacted Households</strong> on 5/30/2024, 12:53:56 PM</p>
        <em>Reason given: Correction needed<em>
        <p>This email is for information purposes, no action is necessarily required.</p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate correct email template for manual update when only one value updated', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = householdCountUpdate(
      applicationId,
      url,
      { givenName: 'CCBC USER' },
      {
        ...defaultParams,
        manualUpdate: true,
        reasonProvided: 'Correction needed',
        fieldsChanged: {
          'Eligible Households': { old: 100, new: 150 },
        },
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject: 'CCBC USER has updated the household numbers for CCBC-12345',
        body: sanitizeBody(`
        <p>CCBC USER has manually updated the <strong>Eligible Households</strong> on 5/30/2024, 12:53:56 PM</p>
        <em>Reason given: Correction needed<em>

        <p>This email is for information purposes, no action is necessarily required.</p>
        <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate email template for upload update for analyst RFI upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = householdCountUpdate(
      applicationId,
      url,
      { givenName: 'CCBC ANALYST' },
      {
        ...defaultParams,
        rfiNumber: 'RFI-001',
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject:
          'CCBC ANALYST has updated the household numbers for CCBC-12345',
        body: sanitizeBody(`
        <p>CCBC ANALYST has uploaded a new Template 1 on 5/30/2024, 12:53:56 PM as part of <strong>RFI : RFI-001</strong> which has updated the following:</p>
        <ul>
          <li>Eligible Households: changed from 100 to 150</li><li>Indigenous Impacted Households: changed from 100 to 150</li>
        </ul>

      <p>This email is for information purposes, no action is necessarily required.</p>
      <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate email template for upload update for analyst RFI upload when one field updated', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = householdCountUpdate(
      applicationId,
      url,
      { givenName: 'CCBC ANALYST' },
      {
        ...defaultParams,
        fieldsChanged: {
          'Eligible Households': { old: 100, new: 150 },
        },
        rfiNumber: 'RFI-001',
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject:
          'CCBC ANALYST has updated the household numbers for CCBC-12345',
        body: sanitizeBody(`
        <p>CCBC ANALYST has uploaded a new Template 1 on 5/30/2024, 12:53:56 PM as part of <strong>RFI : RFI-001</strong> which has updated the following:</p>
        <ul>
          <li>Eligible Households: changed from 100 to 150</li>
        </ul>

      <p>This email is for information purposes, no action is necessarily required.</p>
      <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });

  it('should generate email template for upload update for applicant RFI upload', () => {
    const applicationId = '1';
    const url = 'http://mock_host.ca';

    const emailTemplate: any = householdCountUpdate(
      applicationId,
      url,
      { givenName: 'CCBC APPLICANT' },
      {
        ...defaultParams,
        rfiNumber: 'RFI-001',
        organizationName: 'CCBC ORG',
      }
    );

    emailTemplate.body = sanitizeBody(emailTemplate.body);

    expect(emailTemplate).toEqual(
      expect.objectContaining({
        emailTo: [77],
        emailCC: [],
        tag: 'agreement-signed-status-change',
        subject: 'CCBC ORG has updated the household numbers for CCBC-12345',
        body: sanitizeBody(`
        <p>CCBC ORG has uploaded a new Template 1 on 5/30/2024, 12:53:56 PM as part of <strong>RFI : RFI-001</strong> which has updated the following:</p>
        <ul>
          <li>Eligible Households: changed from 100 to 150</li><li>Indigenous Impacted Households: changed from 100 to 150</li>
        </ul>

      <p>This email is for information purposes, no action is necessarily required.</p>
      <p>To unsubscribe from this notification please forward this email with your request to <a href="mailto:meherzad.romer@gov.bc.ca">meherzad.romer@gov.bc.ca<a/></p>`),
      })
    );
  });
});
