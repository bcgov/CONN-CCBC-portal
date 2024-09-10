import assessmentAssigneeChange from 'backend/lib/emails/templates/assessmentAssigneeChange';
import { mocked } from 'jest-mock';
import { performQuery } from '../../../../../backend/lib/graphql';

jest.mock('../../../../../backend/lib/graphql', () => ({
  performQuery: jest.fn(),
}));

describe('assessmentAssigneeChange template', () => {
  it('should return an email template with correct properties', async () => {
    const req = {
      body: { applicationId: '1', host: 'http://mock_host.ca' },
    };
    mocked(performQuery).mockResolvedValue({
      data: {
        allCcbcUsers: {
          edges: [
            {
              node: {
                rowId: 1,
                givenName: 'Assignor 1',
              },
            },
            {
              node: {
                rowId: 2,
                givenName: 'Assignor 2',
              },
            },
            {
              node: {
                rowId: 3,
                givenName: 'Assignor 3',
              },
            },
          ],
        },
      },
    });
    const applicationId = '1';
    const url = 'http://mock_host.ca';
    const dummyAssignments = [
      {
        applicationId: 1,
        assessmentType: 'technical',
        assignedTo: 'Tester 1',
        assigneeEmail: 'tester1@mail.com',
        ccbcNumber: 'CCBC-000001',
        updatedBy: '1',
      },
      {
        applicationId: 2,
        assessmentType: 'technical',
        assignedTo: 'Tester 2',
        assigneeEmail: 'tester2@mail.com',
        ccbcNumber: 'CCBC-000002',
        updatedBy: '2',
      },
      {
        applicationId: 3,
        assessmentType: 'financialRisk',
        assignedTo: 'Tester 2',
        assigneeEmail: 'tester2@mail.com',
        ccbcNumber: 'CCBC-000003',
        updatedBy: '3',
      },
    ];

    const emailTemplate = await assessmentAssigneeChange(
      applicationId,
      url,
      {},
      { assignments: dummyAssignments },
      req
    );

    expect(emailTemplate.contexts[0].context.assignorList).toEqual([
      'Assignor 1',
    ]);
    expect(emailTemplate.contexts[1].context.assignorList).toEqual([
      'Assignor 2',
      'Assignor 3',
    ]);
    expect(emailTemplate.contexts[0].context.assignee).toEqual(
      'tester1@mail.com'
    );
    expect(emailTemplate.contexts[1].context.assignee).toEqual(
      'tester2@mail.com'
    );
    expect(emailTemplate.contexts[0].context.actions).toEqual([
      {
        alerts: [
          {
            ccbcNumber: 'CCBC-000001',
            applicationId: 1,
            type: 'Technical assessment',
            url: 'http://mock_host.ca/analyst/application/1/assessments/technical',
          },
        ],
        assignors: 'Assignor 1',
      },
    ]);
    expect(emailTemplate.contexts[1].context.actions).toEqual([
      {
        alerts: [
          {
            ccbcNumber: 'CCBC-000002',
            applicationId: 2,
            type: 'Technical assessment',
            url: 'http://mock_host.ca/analyst/application/2/assessments/technical',
          },
        ],
        assignors: 'Assignor 2',
      },
      {
        alerts: [
          {
            ccbcNumber: 'CCBC-000003',
            applicationId: 3,
            type: 'Financial Risk assessment',
            url: 'http://mock_host.ca/analyst/application/3/assessments/financial-risk',
          },
        ],
        assignors: 'Assignor 3',
      },
    ]);
  });
});
