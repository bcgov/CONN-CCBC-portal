import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import AssessmentAssignmentTable, {
  filterAnalysts,
  filterCcbcId,
  sortAnalysts,
  sortStatus,
} from 'components/AnalystDashboard/AssessmentAssignmentTable';
import compiledQuery, {
  AssessmentAssignmentTableTestQuery,
} from '__generated__/AssessmentAssignmentTableTestQuery.graphql';

const testQuery = graphql`
  query AssessmentAssignmentTableTestQuery @relay_test_operation {
    ...AssessmentAssignmentTable_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      allAnalysts: {
        edges: [
          {
            node: {
              familyName: 'Analyst GIS',
              givenName: 'Test',
              active: true,
            },
          },
          {
            node: {
              familyName: 'Analyst Project Management',
              givenName: 'Test',
              active: true,
            },
          },
          {
            node: {
              familyName: 'Analyst Permitting',
              givenName: 'Test',
              active: true,
            },
          },
          {
            node: {
              familyName: 'Analyst Technical',
              givenName: 'Test',
              active: true,
            },
          },
        ],
      },
      allApplications: {
        edges: [
          {
            node: {
              allAssessments: {
                edges: [
                  {
                    node: {
                      jsonData: {
                        nextStep: 'Not started',
                        assignedTo: 'Test Analyst GIS',
                      },
                      assessmentDataType: 'gis',
                      rowId: 2,
                    },
                  },
                  {
                    node: {
                      jsonData: {
                        nextStep: 'Needs 2nd review',
                        assignedTo: 'Test Analyst Project Management',
                      },
                      assessmentDataType: 'projectManagement',
                      rowId: 4,
                    },
                  },

                  {
                    node: {
                      jsonData: {
                        nextStep: 'Needs RFI',
                        assignedTo: 'Test Analyst Permitting',
                      },
                      assessmentDataType: 'permitting',
                      rowId: 6,
                    },
                  },
                  {
                    node: {
                      jsonData: {
                        decision: 'No decision',
                        nextStep: 'Assessment complete',
                        assignedTo: 'Test Analyst Technical',
                        targetDate: '2023-10-26',
                      },
                      assessmentDataType: 'technical',
                      rowId: 7,
                      updatedAt: '2024-04-23T00:57:02.743866+00:00',
                    },
                  },
                ],
              },
              notificationsByApplicationId: {
                edges: [
                  {
                    node: {
                      jsonData: { to: 'Tester 1' },
                      notificationType: 'assignment_technical',
                      createdAt: '2020-04-23T00:57:02.743866+00:00',
                    },
                  },
                ],
              },
              organizationName: 'org name received',
              status: 'received',
              ccbcNumber: 'CCBC-010001',
              rowId: 1,
              intakeNumber: 1,
              zones: [2],
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'org name 2',
              status: 'received',
              ccbcNumber: 'CCBC-010002',
              rowId: 2,
              intakeNumber: 1,
              zones: [2],
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'more testing',
              status: 'received',
              ccbcNumber: 'CCBC-010006',
              rowId: 8,
              intakeNumber: 1,
              zones: [5],
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'org name ',
              status: 'received',
              ccbcNumber: 'CCBC-010007',
              rowId: 9,
              intakeNumber: 2,
              zones: [2],
            },
          },
        ],
      },
    };
  },
};

const mockQueryPayloadUnassignedTechAssesment = {
  Query() {
    return {
      ...mockQueryPayload.Query(),
      allApplications: {
        edges: [
          {
            node: {
              allAssessments: {
                edges: [
                  {
                    node: {
                      jsonData: {
                        decision: 'No decision',
                        nextStep: 'Assessment complete',
                        assignedTo: null,
                        targetDate: '2023-10-26',
                      },
                      assessmentDataType: 'technical',
                      rowId: 7,
                      updatedAt: '2024-04-23T00:57:02.743866+00:00',
                    },
                  },
                ],
              },
              notificationsByApplicationId: {
                edges: [
                  {
                    node: {
                      jsonData: { to: 'Tester 1' },
                      notificationType: 'assignment_technical',
                      createdAt: '2020-04-23T00:57:02.743866+00:00',
                    },
                  },
                ],
              },
              organizationName: 'org name received',
              status: 'received',
              ccbcNumber: 'CCBC-010001',
              rowId: 1,
              intakeNumber: 1,
              zones: [2],
            },
          },
        ],
      },
    };
  },
};

jest.setTimeout(10000);

const componentTestingHelper =
  new ComponentTestingHelper<AssessmentAssignmentTableTestQuery>({
    component: AssessmentAssignmentTable,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
    }),
  });

describe('The AssessmentAssignmentTable component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('should render the table headers', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Intake')).toBeInTheDocument();
    expect(screen.getByText('CCBC ID')).toBeInTheDocument();
    expect(screen.getByText('Zone')).toBeInTheDocument();
    expect(screen.getByText('PM')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Permitting')).toBeInTheDocument();
    expect(screen.getByText('GIS')).toBeInTheDocument();
    expect(screen.getByText('Organization Name')).toBeInTheDocument();
  });

  it('should render the row count data', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const countRows = screen.getAllByText(/Showing 4 of 4 rows/i);
    expect(countRows).toHaveLength(2);
  });

  it('should render the row count data correctly with filters', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const columnActions = document.querySelectorAll(
      '[aria-label="Column Actions"]'
    )[1];
    await act(async () => {
      fireEvent.click(columnActions);
    });

    const ccbcIdFilter = screen.getByText('Filter by CCBC ID');
    await act(async () => {
      fireEvent.click(ccbcIdFilter);
    });

    const filterInput = screen.getByPlaceholderText(
      'Filter by CCBC ID'
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(filterInput, { target: { value: 'CCBC-010001' } });
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    const countRows = screen.getAllByText(/Showing 1 of 4 rows/i);
    expect(countRows).toHaveLength(2);

    await act(async () => {
      fireEvent.change(filterInput, { target: { value: '' } });
    });
    await new Promise((r) => {
      setTimeout(r, 500);
    });
  });

  it('should render legend correctly', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Legend:')).toBeInTheDocument();

    const legendStatuses = [
      { status: 'Not started', backgroundColor: '#FFFFFF' },
      { status: 'Assigned', backgroundColor: '#DBE6F0' },
      { status: 'Need 2nd Review/Needs RFI', backgroundColor: '#F8E78F' },
      { status: 'Assessment complete', backgroundColor: '#2E8540' },
    ];
    legendStatuses.forEach((type) => {
      expect(screen.getByText(type.status)).toBeInTheDocument();
      expect(screen.getByText(type.status)).toHaveStyle({
        backgroundColor: type.backgroundColor,
      });
    });
  });

  it('should render the correct row data', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();
    expect(
      screen.getAllByText('Test Analyst Project Management')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Test Analyst Technical')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Test Analyst Permitting')[0]
    ).toBeInTheDocument();
    expect(screen.getAllByText('Test Analyst GIS')[0]).toBeVisible();
    expect(screen.getByText('org name received')).toBeInTheDocument();
  });

  it('should call the mutation when the analyst is changed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const analystSelect = screen.getAllByTestId('assign-lead')[0];

    await act(async () => {
      fireEvent.change(analystSelect, { target: { value: 'Test Analyst' } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createAssessmentMutation',
      {
        input: {
          _assessmentType: 'screening',
          _jsonData: {
            assignedTo: null,
          },
          _applicationId: 1,
        },
        connections: [expect.anything()],
      }
    );
  });

  it('should correctly filter the Intake ID column', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    jest.setTimeout(5000);

    expect(screen.getByText('CCBC-010007')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Show/Hide filters"]'
    )[0];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const intakeNumberFilter = screen.getAllByText('Filter by Intake')[0];

    await act(async () => {
      fireEvent.keyDown(intakeNumberFilter, { key: 'Enter', code: 'Enter' });
    });

    const filterInput = screen.getAllByRole('option')[0];

    await act(async () => {
      fireEvent.click(filterInput);
    });

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.queryByText('CCBC-010007')).not.toBeInTheDocument();
  });

  it('should correctly filter the Zone column', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010006')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Show/Hide filters"]'
    )[0];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const zoneFilter = screen.getAllByText('Filter by Zone')[0];

    await act(async () => {
      fireEvent.keyDown(zoneFilter, { key: 'Enter', code: 'Enter' });
    });

    const filterInput = screen.getAllByRole('option')[0];

    await act(async () => {
      fireEvent.click(filterInput);
    });

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.queryByText('CCBC-010006')).not.toBeInTheDocument();
  });

  it('should correctly filter the CCBC ID column', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010002')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Column Actions"]'
    )[1];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const ccbcIdFilter = screen.getByText('Filter by CCBC ID');

    await act(async () => {
      fireEvent.click(ccbcIdFilter);
    });

    const filterInput = screen.getByPlaceholderText('Filter by CCBC ID');

    await act(async () => {
      fireEvent.change(filterInput, { target: { value: 'CCBC-010001' } });
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.queryByText('CCBC-010002')).not.toBeInTheDocument();
  });

  it('should correctly filter the PM Assessment column', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const analyst = screen.queryAllByText('Test Analyst Project Management')[0];

    expect(analyst).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Column Actions"]'
    )[3];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const pmAssessmentFilter = screen.getAllByText('Filter by PM')[0];

    await act(async () => {
      fireEvent.keyDown(pmAssessmentFilter, { key: 'Enter', code: 'Enter' });
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    const filterInput = screen.getAllByRole('option')[0];

    await act(async () => {
      fireEvent.click(filterInput);
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    const analystAfterFilter = screen.queryAllByText(
      'Test Analyst Project Management'
    )[0];

    expect(analystAfterFilter).toBeFalsy();
  });

  it('should clear filters when clear filter clicked', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();

    const clearFilterButton = screen.getByTestId('clear-filter-button');
    await act(async () => {
      fireEvent.click(clearFilterButton);
    });

    expect(screen.queryByText('CCBC-010001')).toBeInTheDocument();
  });

  it('should show active email send icon button when there are pending notifications', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const notifyButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    expect(notifyButton).toBeInTheDocument();

    expect(notifyButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(notifyButton);
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    expect(screen.getByText(/Send email notifications?/)).toBeInTheDocument();

    expect(
      screen.getByText(/will be sent to Test Analyst Technical/)
    ).toBeInTheDocument();
  });

  it('should not show active email send icon button when there are pending notifications but unassigned tech assessment', async () => {
    componentTestingHelper.loadQuery(mockQueryPayloadUnassignedTechAssesment);
    componentTestingHelper.renderComponent();

    const notifyButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    expect(notifyButton).toBeInTheDocument();

    expect(notifyButton).toBeDisabled();
  });

  it('should call the correct endpoint when email notifications are confirmed', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            emailRecordResults: [
              {
                messageId: '123',
                to: ['tester@gov.bc.ca'],
                cc: ['tester@gov.bc.ca'],
                contexts: {},
                body: 'Test Analyst GIS has assigned you one or more assessment(s)',
                subject: 'Assessment Assignee Change Notification',
              },
            ],
            details: {
              assessmentsGrouped: {
                'analyst@gov.bc.ca': [
                  {
                    ccbcNumber: 'CCBC-00001',
                    applicationId: 123,
                    notificationConnectionId: 'connectionID',
                    updatedBy: 1,
                    assignedTo: 'Analyst GIS',
                    assessmentType: 'technical',
                  },
                ],
              },
            },
          }),
        status: 200,
      })
    ) as jest.Mock;

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const notifyButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    await act(async () => {
      fireEvent.click(notifyButton);
    });

    const confirmBtn = screen.getByRole('button', {
      name: 'Yes',
    });

    expect(confirmBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/assessmentAssigneeChange',
      expect.objectContaining({ method: 'POST' })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Email notification sent successfully/)
      ).toBeInTheDocument();
    });
  });

  it('should show the error toast when email notification to CHES failed', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('oops')),
      })
    ) as jest.Mock;

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const notifyButton = screen.getByRole('button', {
      name: 'Notify by email',
    });

    await act(async () => {
      fireEvent.click(notifyButton);
    });

    const confirmBtn = screen.getByRole('button', {
      name: 'Yes',
    });

    expect(confirmBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/email/assessmentAssigneeChange',
      expect.objectContaining({ method: 'POST' })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Email notification did not work, please try again/)
      ).toBeInTheDocument();
    });
  });
});

describe('The filterAnalysts function', () => {
  const mockData = {
    getValue: () => {
      return {
        jsonData: {
          assignedTo: 'Test Analyst GIS',
        },
      };
    },
  };

  it('should return true if the analyst name contains the filter value', () => {
    expect(filterAnalysts(mockData, 1, 'GIS')).toBeTruthy();
  });

  it('should return false if the analyst name does not contain the filter value', () => {
    expect(filterAnalysts(mockData, 1, 'PM')).toBeFalsy();
  });
});

describe('The filterCcbcId function', () => {
  const mockData = {
    getValue: () => {
      return 'CCBC-010001';
    },
  };

  it('should return true if the CCBC ID contains the filter value', () => {
    expect(filterCcbcId(mockData, 1, 'CCBC-010001')).toBeTruthy();
  });

  it('should return false if the CCBC ID does not contain the filter value', () => {
    expect(filterCcbcId(mockData, 1, 'CCBC-010002')).toBeFalsy();
  });
});

describe('The sortAnalysts function', () => {
  const mockDataA = {
    getValue: () => {
      return {
        jsonData: {
          assignedTo: 'Test Analyst GIS',
        },
      };
    },
  };

  const mockDataB = {
    getValue: () => {
      return {
        jsonData: {
          assignedTo: 'Test Analyst Project Management',
        },
      };
    },
  };

  const mockDataC = {
    getValue: () => {
      return {
        jsonData: {
          assignedTo: null,
        },
      };
    },
  };

  it('should return -1 if the first analyst is null', () => {
    expect(sortAnalysts(mockDataC, mockDataA, 1)).toEqual(-1);
  });

  it('should return 1 if the second analyst is null', () => {
    expect(sortAnalysts(mockDataA, mockDataC, 1)).toEqual(1);
  });

  it('should return 0 if both analysts are null', () => {
    expect(sortAnalysts(mockDataC, mockDataC, 1)).toEqual(0);
  });

  it('should return 1 if the first analyst is null', () => {
    expect(sortAnalysts(mockDataA, mockDataC, 1)).toEqual(1);
  });

  it('should return -1 if both analysts are not null', () => {
    expect(sortAnalysts(mockDataA, mockDataB, 1)).toEqual(-1);
  });
});

describe('The sortStatus function', () => {
  it('should sort based on internalStatusOrder when columnId is "analystStatus"', () => {
    const rowA = { original: { internalStatusOrder: 2 } };
    const rowB = { original: { internalStatusOrder: 1 } };

    const result = sortStatus(rowA, rowB, 'analystStatus');

    expect(result).toBeGreaterThan(0);
  });

  it('should sort based on externalStatusOrder when columnId is not "analystStatus"', () => {
    const rowA = { original: { externalStatusOrder: 1 } };
    const rowB = { original: { externalStatusOrder: 2 } };

    const result = sortStatus(rowA, rowB, 'someOtherStatus');

    expect(result).toBeLessThan(0);
  });

  it('should return 0 when both statuses are equal', () => {
    const rowA = { original: { externalStatusOrder: 3 } };
    const rowB = { original: { externalStatusOrder: 3 } };

    const result = sortStatus(rowA, rowB, 'someOtherStatus');

    expect(result).toBe(0);
  });

  it('should handle missing status values by treating them as 0', () => {
    const rowA = { original: { internalStatusOrder: undefined } };
    const rowB = { original: { internalStatusOrder: 1 } };

    const result = sortStatus(rowA, rowB, 'analystStatus');

    expect(result).toBeLessThan(0);
  });
});
