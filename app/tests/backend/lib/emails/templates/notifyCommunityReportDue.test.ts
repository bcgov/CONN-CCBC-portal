import { mocked } from 'jest-mock';
import notifyCommunityReportDue from '../../../../../backend/lib/emails/templates/notifyCommunityReportDue';
import { performQuery } from '../../../../../backend/lib/graphql';

jest.mock('../../../../../backend/lib/graphql', () => ({
  performQuery: jest.fn(),
}));

jest.mock('../../../../../backend/lib/emails/handleEmailNotification', () => ({
  replaceEmailsInNonProd: jest.fn((emails) => emails),
}));

describe('notifyCommunityReportDue template', () => {
  it('should return an email template with correct properties', async () => {
    const req = {
      body: { applicationId: '1', host: 'http://mock_host.ca' },
    };

    // Mock the performQuery function to return analyst data
    mocked(performQuery).mockResolvedValue({
      data: {
        allAnalysts: {
          nodes: [
            {
              email: 'analyst1@example.com',
              givenName: 'Analyst One',
            },
            {
              email: 'analyst2@example.com',
              givenName: 'Analyst Two',
            },
          ],
        },
      },
    });

    const applicationId = '1';
    const url = 'http://mock_host.ca';
    const communityReportData = [
      {
        milestoneNumber: 1,
        organizationName: 'Organization A',
        ccbcNumber: 'CCBC-000001',
        dueDate: '2023-11-01',
      },
      {
        milestoneNumber: 2,
        organizationName: 'Organization B',
        ccbcNumber: 'CCBC-000002',
        dueDate: '2023-12-01',
      },
    ];

    const params = { communityReportData };
    const emailTemplate = await notifyCommunityReportDue(
      applicationId,
      url,
      {},
      params,
      req
    );

    // Check that the subject is correct
    expect(emailTemplate.subject).toEqual(
      'Reminder: Community Progress Reports are coming Due'
    );

    // Ensure contexts are created for each analyst
    expect(emailTemplate.contexts.length).toBe(2);

    // Validate the first context
    expect(emailTemplate.contexts[0].to).toEqual(['analyst1@example.com']);
    expect(emailTemplate.contexts[0].context.recipientName).toEqual(
      'Analyst One'
    );
    expect(emailTemplate.contexts[0].context.communities).toEqual(
      communityReportData
    );

    // Validate the second context
    expect(emailTemplate.contexts[1].to).toEqual(['analyst2@example.com']);
    expect(emailTemplate.contexts[1].context.recipientName).toEqual(
      'Analyst Two'
    );
    expect(emailTemplate.contexts[1].context.communities).toEqual(
      communityReportData
    );

    // Check other properties
    expect(emailTemplate.tag).toEqual('community-progress-report-due');
    expect(emailTemplate.params).toEqual({ communityReportData });

    // Optionally, you can check the body content if needed
    expect(emailTemplate.body).toContain(
      '<p>Hi {{ recipientName | trim }} </p>'
    );
  });
});
