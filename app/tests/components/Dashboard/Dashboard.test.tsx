import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardTable } from '../../../components/Dashboard';
import { graphql } from 'react-relay';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledDashboardTestQuery, {
  DashboardTestQuery,
} from '../../../__generated__/DashboardTestQuery.graphql';

const testQuery = graphql`
  query DashboardTestQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner) {
      nodes {
        id
        rowId
        createdBy
        referenceNumber
        status
        projectName
        ccbcId
        lastEditedPage
        intakeByIntakeId {
          ccbcIntakeNumber
          closeTimestamp
          openTimestamp
        }
      }
    }
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      allApplications: {
        nodes: [
          {
            id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
            rowId: 2,
            owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
            referenceNumber: 1,
            status: 'withdrawn',
            projectName: null,
            ccbcId: 'CCBC-010001',
            lastEditedPage: '',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
              openTimestamp: '2022-07-25T00:00:00-07:00',
            },
          },
          {
            id: 'WyJhcHBsaWNhdGlvbnMiLDNd',
            rowId: 3,
            owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
            referenceNumber: 2,
            status: 'submitted',
            projectName: null,
            ccbcId: 'CCBC-010002',
            lastEditedPage: '',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
              openTimestamp: '2022-07-25T00:00:00-07:00',
            },
          },
          {
            id: 'WyJhcHBsaWNhdGlvbnMiLDRd',
            rowId: 4,
            owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
            referenceNumber: 3,
            status: 'submitted',
            projectName: null,
            ccbcId: 'CCBC-010003',
            lastEditedPage: '',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-09T13:49:23.513427-07:00',
              openTimestamp: '2022-07-25T00:00:00-07:00',
            },
          },
        ],
      },
    };
  },
};

const componentTestingHelper = new ComponentTestingHelper<DashboardTestQuery>({
  component: DashboardTable,
  testQuery: testQuery,
  compiledQuery: compiledDashboardTestQuery,
  getPropsFromTestQuery: (data) => {
    return {
      applications: data,
    };
  },
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
            nodes: [
              {
                id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
                rowId: 1,
                owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                referenceNumber: null,
                status: 'draft',
                projectName: null,
                ccbcId: null,
                lastEditedPage: 'templateUploads',
                intakeByIntakeId: null,
              },
            ],
          },
        };
      },
    };
    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-btn-test')).toBeNull();
  });

  it('Renders a submitted application with the intake still open', async () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            nodes: [
              {
                id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                rowId: 2,
                owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                referenceNumber: 1,
                status: 'submitted',
                projectName: null,
                ccbcId: 'CCBC-010004',
                lastEditedPage: '',
                intakeByIntakeId: {
                  ccbcIntakeNumber: 1,
                  closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                  openTimestamp: '2022-07-25T00:00:00-07:00',
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
    expect(screen.getByText('submitted')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();
  });

  it('Calls the correct mutation when the withdraw button is clicked', async () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            nodes: [
              {
                id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                rowId: 2,
                owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                referenceNumber: 1,
                status: 'submitted',
                projectName: null,
                ccbcId: 'CCBC-010005',
                lastEditedPage: '',
                intakeByIntakeId: {
                  ccbcIntakeNumber: 1,
                  closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                  openTimestamp: '2022-07-25T00:00:00-07:00',
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
    expect(screen.getByText('submitted')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-btn-test')).toBeInTheDocument();

    const withdrawBtn = screen.getByTestId('withdraw-btn-test');
    await user.click(withdrawBtn);

    const withdrawModalBtn = screen.getByTestId('withdraw-yes-btn');
    await user.click(withdrawModalBtn);

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            status: 'withdrawn',
          },
          id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
        },
      }
    );
  });

  it('Renders a submitted application with the intake closed', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            nodes: [
              {
                id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                rowId: 2,
                owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                referenceNumber: 1,
                status: 'submitted',
                projectName: null,
                ccbcId: 'CCBC-010005',
                lastEditedPage: '',
                intakeByIntakeId: {
                  ccbcIntakeNumber: 1,
                  closeTimestamp: '2021-09-09T13:49:23.513427-07:00',
                  openTimestamp: '2020-07-25T00:00:00-07:00',
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
    expect(screen.getByText('submitted')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-btn-test')).toBeNull();
  });

  it('Renders a withdrawn application', () => {
    const payload = {
      Query() {
        return {
          allApplications: {
            nodes: [
              {
                id: 'WyJhcHBsaWNhdGlvbnMiLDJd',
                rowId: 2,
                owner: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
                referenceNumber: 1,
                status: 'withdrawn',
                projectName: null,
                ccbcId: 'CCBC-010005',
                lastEditedPage: '',
                intakeByIntakeId: {
                  ccbcIntakeNumber: 1,
                  closeTimestamp: '2024-09-09T13:49:23.513427-07:00',
                  openTimestamp: '2022-07-25T00:00:00-07:00',
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
    expect(screen.getByText('withdrawn')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.queryByTestId('withdraw-btn-test')).toBeNull();
  });
});
