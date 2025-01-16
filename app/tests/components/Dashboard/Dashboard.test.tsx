import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { graphql } from 'react-relay';
import { schema } from 'formSchema';
import { DashboardTable } from '../../../components/Dashboard';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledDashboardTestQuery, {
  DashboardTestQuery,
} from '../../../__generated__/DashboardTestQuery.graphql';

const testQuery = graphql`
  query DashboardTestQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner) {
      __id
      edges {
        node {
          id
          rowId
          owner
          status
          projectName
          ccbcNumber
          formData {
            lastEditedPage
            isEditable
            formByFormSchemaId {
              jsonSchema
            }
          }
          intakeByIntakeId {
            ccbcIntakeNumber
            closeTimestamp
            openTimestamp
          }
        }
      }
    }
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      allApplications: {
        edges: [
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
              rowId: 2,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'withdrawn',
              projectName: null,
              ccbcNumber: 'CCBC-010001',
              formData: {
                lastEditedPage: '',
                isEditable: false,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 1,
                closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
                openTimestamp: '2022-07-25T00:00:00-07:00',
              },
            },
          },
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDNd',
              rowId: 3,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'submitted',
              projectName: null,
              ccbcNumber: 'CCBC-010002',
              formData: {
                lastEditedPage: '',
                isEditable: true,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 1,
                closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
                openTimestamp: '2022-07-25T00:00:00-07:00',
              },
            },
          },
          {
            node: {
              id: 'WyJhcHBsaWNhdGlvbnMiLDRd',
              rowId: 4,
              owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
              status: 'submitted',
              projectName: null,
              ccbcNumber: 'CCBC-010003',
              formData: {
                lastEditedPage: '',
                isEditable: true,
                formByFormSchemaId: {
                  jsonSchema: schema,
                },
              },
              intakeByIntakeId: {
                ccbcIntakeNumber: 1,
                closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
                openTimestamp: '2022-07-25T00:00:00-07:00',
              },
            },
          },
        ],
      },
    };
  },
};

const componentTestingHelper = new ComponentTestingHelper<DashboardTestQuery>({
  component: DashboardTable,
  testQuery,
  compiledQuery: compiledDashboardTestQuery,
  getPropsFromTestQuery: (data) => ({
    applications: data,
  }),
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    formOwner: { owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6' },
  },
  defaultComponentProps: {},
});

describe('The Dashboard', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('Lists the owners applications CCBC ID', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010001')).toBeVisible();
    expect(screen.getByText('CCBC-010002')).toBeVisible();
    expect(screen.getByText('CCBC-010003')).toBeVisible();
  });

  it('Renders a draft application', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
                  rowId: 1,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'draft',
                  projectName: null,
                  ccbcNumber: null,
                  formData: {
                    lastEditedPage: 'templateUploads',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: null,
                },
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    // expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-btn-test')).toBeNull();
  });

  it('Renders a submitted application with the intake still open', async () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                  rowId: 2,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'submitted',
                  projectName: null,
                  ccbcNumber: 'CCBC-010004',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: {
                    ccbcIntakeNumber: 1,
                    closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                    openTimestamp: '2022-07-25T00:00:00-07:00',
                  },
                },
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();

    expect(screen.getByText('CCBC-010004')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    // expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();
  });

  it('Calls the correct mutation when the withdraw button is clicked', async () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                  rowId: 2,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'submitted',
                  projectName: null,
                  ccbcNumber: 'CCBC-010005',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: {
                    ccbcIntakeNumber: 1,
                    closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                    openTimestamp: '2022-07-25T00:00:00-07:00',
                  },
                },
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    const user = userEvent.setup();

    componentTestingHelper.renderComponent();
    expect(screen.getByText('CCBC-010005')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    // expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();

    const withdrawBtn = screen.getByTestId('withdraw-btn-test');
    await user.click(withdrawBtn);

    const withdrawModalBtn = screen.getByTestId('withdraw-yes-btn');
    await user.click(withdrawModalBtn);

    componentTestingHelper.expectMutationToBeCalled(
      'withdrawApplicationMutation',
      {
        input: {
          applicationRowId: 2,
        },
      }
    );
  });

  it('Renders a submitted application with the intake closed', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                  rowId: 2,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'submitted',
                  projectName: null,
                  ccbcNumber: 'CCBC-010005',
                  formData: {
                    lastEditedPage: '',
                    isEditable: false,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: {
                    ccbcIntakeNumber: 1,
                    closeTimestamp: '2021-09-09T13:49:23.513427-07:00',
                    openTimestamp: '2020-07-25T00:00:00-07:00',
                  },
                },
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();
    expect(screen.getByText('CCBC-010005')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('Renders a withdrawn application', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                  rowId: 2,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'withdrawn',
                  projectName: null,
                  ccbcNumber: 'CCBC-010005',
                  formData: {
                    lastEditedPage: '',
                    isEditable: false,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: {
                    ccbcIntakeNumber: 1,
                    closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                    openTimestamp: '2022-07-25T00:00:00-07:00',
                  },
                },
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();
    expect(screen.getByText('CCBC-010005')).toBeInTheDocument();
    expect(screen.getByText('Withdrawn')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-btn-test')).toBeNull();
  });

  it('Calls the correct mutation when the delete button is clicked', async () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                  rowId: 2,
                  owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                  status: 'draft',
                  projectName: null,
                  ccbcNumber: null,
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                  intakeByIntakeId: {
                    ccbcIntakeNumber: 1,
                    closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                    openTimestamp: '2022-07-25T00:00:00-07:00',
                  },
                },
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    const user = userEvent.setup();

    componentTestingHelper.renderComponent();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByTestId('archive-btn-test')).toBeInTheDocument();

    const archiveBtn = screen.getByTestId('archive-btn-test');
    await user.click(archiveBtn);

    const archiveModalBtn = screen.getByTestId('archive-yes-btn');
    await user.click(archiveModalBtn);

    componentTestingHelper.expectMutationToBeCalled(
      'archiveApplicationMutation',
      {
        input: {
          applicationRowId: 2,
        },
      }
    );
  });

  it('renders the withdraw button for submitted applications', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  status: 'submitted',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                },
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);

    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();
  });

  it('renders the withdraw button for received applications', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  status: 'received',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                },
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);

    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();
  });

  it('renders the withdraw button for conditionally_approved applications', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  status: 'applicant_conditionally_approved',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                },
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);

    componentTestingHelper.renderComponent();

    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();
  });

  it('does not the withdraw button for draft applications', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            edges: [
              {
                node: {
                  status: 'draft',
                  formData: {
                    lastEditedPage: '',
                    isEditable: true,
                    formByFormSchemaId: {
                      jsonSchema: schema,
                    },
                  },
                },
              },
            ],
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);

    componentTestingHelper.renderComponent();

    expect(screen.queryByTestId('withdraw-btn-test')).not.toBeInTheDocument();
  });
});
