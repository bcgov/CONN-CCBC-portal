import { act, fireEvent, screen } from '@testing-library/react';
import { graphql } from 'react-relay';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';
import AssessmentAssignmentTable, {
  filterAnalysts,
  filterCcbcId,
  sortAnalysts,
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
                        nextStep: 'Not started',
                        assignedTo: 'Test Analyst Project Management',
                      },
                      assessmentDataType: 'projectManagement',
                      rowId: 4,
                    },
                  },

                  {
                    node: {
                      jsonData: {
                        nextStep: 'Not started',
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
                        nextStep: 'Not started',
                        assignedTo: 'Test Analyst Technical',
                        targetDate: '2023-10-26',
                      },
                      assessmentDataType: 'technical',
                      rowId: 7,
                    },
                  },
                ],
              },
              organizationName: 'org name received',
              package: 1,
              status: 'received',
              ccbcNumber: 'CCBC-010001',
              rowId: 1,
              projectName: 'Received Application Title',
              intakeId: 1,
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'org name 2',
              package: null,
              status: 'received',
              ccbcNumber: 'CCBC-010002',
              rowId: 2,
              projectName: 'Received Application Title 2',
              intakeId: 1,
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'more testing',
              package: null,
              status: 'received',
              ccbcNumber: 'CCBC-010006',
              rowId: 8,
              projectName: null,
              intakeId: 1,
            },
          },
          {
            node: {
              allAssessments: {
                edges: [],
              },
              organizationName: 'org name ',
              package: null,
              status: 'received',
              ccbcNumber: 'CCBC-010007',
              rowId: 9,
              projectName: null,
              intakeId: 1,
            },
          },
        ],
      },
    };
  },
};

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

    expect(screen.getByText('CCBC ID')).toBeInTheDocument();
    expect(screen.getByText('Package')).toBeInTheDocument();
    expect(screen.getByText('PM Assessment')).toBeInTheDocument();
    expect(screen.getByText('Tech Assessment')).toBeInTheDocument();
    expect(screen.getByText('Permitting Assessment')).toBeInTheDocument();
    expect(screen.getByText('GIS Assessment')).toBeInTheDocument();
    expect(screen.getByText('Project Title')).toBeInTheDocument();
    expect(screen.getByText('Organization Name')).toBeInTheDocument();
  });

  it('should render the correct row data', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
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
    expect(screen.getByText('2023-10-26')).toBeVisible();
    expect(screen.getByText('Received Application Title')).toBeInTheDocument();
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
          _assessmentType: 'projectManagement',
          _jsonData: {
            nextStep: 'Not started',
            assignedTo: '',
          },
          _applicationId: 1,
        },
      }
    );
  });

  it('should correctly filter the CCBC ID column', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010002')).toBeVisible();

    const columnActions = document.querySelectorAll(
      '[aria-label="Column Actions"]'
    )[0];

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
    )[2];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const pmAssessmentFilter = screen.getByText('Filter by PM Assessment');

    await act(async () => {
      fireEvent.click(pmAssessmentFilter);
    });

    const filterInput = screen.getByPlaceholderText('Filter by PM Assessment');

    await act(async () => {
      fireEvent.change(filterInput, { target: { value: 'Test Analyst GIS' } });
    });

    await new Promise((r) => {
      setTimeout(r, 500);
    });

    const analystAfterFilter = screen.queryAllByText(
      'Test Analyst Project Management'
    )[0];

    expect(analystAfterFilter).toBeFalsy();
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
