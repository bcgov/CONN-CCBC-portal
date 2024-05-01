import { mocked } from 'jest-mock';
import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import * as moduleApi from '@growthbook/growthbook-react';
import cookie from 'js-cookie';
import Dashboard from '../../../pages/analyst/dashboard';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compileddashboardQuery, {
  dashboardAnalystQuery,
} from '../../../__generated__/dashboardAnalystQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_analyst',
      },
      totalAvailableApplications: { totalCount: 10 },
      allApplications: {
        edges: [
          {
            node: {
              id: '1',
              rowId: 1,
              analystStatus: 'received',
              externalStatus: 'closed',
              projectName: 'Test Proj Name',
              ccbcNumber: 'CCBC-010001',
              organizationName: 'Test Org Name',
              intakeNumber: 1,
              zone: 1,
              zones: [1, 2],
            },
          },
          {
            node: {
              id: '2',
              rowId: 2,
              analystStatus: 'approved',
              externalStatus: 'closed',
              projectName: 'Test Proj Name 2',
              ccbcNumber: 'CCBC-010002',
              organizationName: 'Test Org Name 2',
              intakeNumber: 2189,
              zone: null,
              zones: [],
            },
          },
          {
            node: {
              id: '3',
              rowId: 3,
              analystStatus: 'cancelled',
              externalStatus: 'closed',
              projectName: 'Test Proj Name 3',
              ccbcNumber: 'CCBC-010003',
              organizationName: 'Test Org Name 3',
              intakeNumber: 1,
              zone: null,
              zones: [],
            },
          },
          {
            node: {
              id: '4',
              rowId: 4,
              analystStatus: 'assessment',
              externalStatus: 'closed',
              projectName: 'Test Proj Name 4',
              ccbcNumber: 'CCBC-010004',
              organizationName: 'Test Org Name 4',
              intakeNumber: 3,
              zone: null,
              zones: [],
            },
          },
        ],
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
      allCbcProjects: {
        nodes: [
          {
            jsonData: [
              {
                phase: 2,
                intake: 1,
                errorLog: [],
                highwayKm: null,
                projectType: 'Transport',
                reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
                transportKm: 124,
                lastReviewed: '2023-07-11T00:00:00.000Z',
                otherFunding: 265000,
                projectTitle: 'Project 1',
                dateAnnounced: '2019-07-02T00:00:00.000Z',
                projectNumber: 5555,
                projectStatus: 'Reporting Complete',
                federalFunding: 555555,
                householdCount: null,
                applicantAmount: 555555,
                bcFundingRequest: 5555555,
                projectLocations: 'Location 1',
                milestoneComments: 'Requested extension to March 31, 2024',
                proposedStartDate: '2020-07-01T00:00:00.000Z',
                primaryNewsRelease:
                  'https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html',
                projectDescription: 'Description 1',
                totalProjectBudget: 5555555,
                announcedByProvince: 'YES',
                dateAgreementSigned: '2021-02-24T00:00:00.000Z',
                changeRequestPending: 'No',
                currentOperatingName: 'Internet company 1',
                federalFundingSource: 'ISED-CTI',
                transportProjectType: 'Fibre',
                indigenousCommunities: 5,
                proposedCompletionDate: '2023-03-31T00:00:00.000Z',
                constructionCompletedOn: null,
                dateApplicationReceived: null,
                reportingCompletionDate: null,
                applicantContractualName: 'Internet company 1',
                dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                eightThirtyMillionFunding: 'No',
                projectMilestoneCompleted: 0.5,
                communitiesAndLocalesCount: 5,
                connectedCoastNetworkDependant: 'NO',
                nditConditionalApprovalLetterSent: 'YES',
                bindingAgreementSignedNditRecipient: 'YES',
              },
            ],
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');
window.scrollTo = jest.fn();

const mockShowLeadColumn = (
  value: boolean
): moduleApi.FeatureResult<boolean> => ({
  value,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_lead',
});

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
  set: jest.fn(),
}));

const pageTestingHelper = new PageTestingHelper<dashboardAnalystQuery>({
  pageComponent: Dashboard,
  compiledQuery: compileddashboardQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    cookie.get.mockImplementation(() => null);
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(false));
    pageTestingHelper.reinit();
  });

  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/analyst/dashboard',
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst',
      },
    });
  });

  it('should redirect a user logged in with IDIR but not assigned a role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/dashboard',
        claims: {
          client_roles: [],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/request-access',
      },
    });
  });

  it('should not redirect a user logged in with IDIR and an assigned role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/dashboard',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('displays the Analyst Table', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('Test Proj Name')).toBeInTheDocument();
    expect(screen.getByText('Test Org Name')).toBeInTheDocument();

    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
    expect(screen.getByText('Test Proj Name 2')).toBeInTheDocument();
    expect(screen.getByText('Test Org Name 2')).toBeInTheDocument();
  });

  it('analyst table headers are consistent', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Project ID')).toBeInTheDocument();
    expect(screen.getByText('Internal Status')).toBeInTheDocument();
    expect(screen.getByText('External Status')).toBeInTheDocument();
    expect(screen.getByText('Project title')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.queryByText('Lead')).not.toBeInTheDocument();
    expect(screen.getByText('Package')).toBeInTheDocument();
  });

  it('analyst table lead only visible when feature enabled', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(true));
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Lead')).toBeInTheDocument();
  });

  it('analysts table will be visible if user set to visible', async () => {
    cookie.get.mockImplementation((key: string) => {
      if (key === 'mrt_show_lead_application') {
        return 'true';
      }
      return null;
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Lead')).toBeInTheDocument();
  });

  it('analysts table will be hidden if user set to hidden', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(true));
    cookie.get.mockImplementation((key) => {
      if (key === 'mrt_show_lead_application') {
        return 'false';
      }
      return null;
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.queryByText('Lead')).not.toBeInTheDocument();
  });

  it('renders analyst table row counts', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const countRows = screen.getAllByText(/Showing 5 of 5 rows/i);
    expect(countRows).toHaveLength(2);
  });

  it('click on table row leads to review page', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const row = screen.getByText('CCBC-010001');

    expect(row).toHaveAttribute('href', '/analyst/application/1');
  });

  it('shows the assign lead dropdown when column enabled', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(true));
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Unassigned', hidden: true })[0]
    ).toBeInTheDocument();
  });

  it('shows the correct options in the assign lead dropdown', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(true));
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getAllByRole('option', { name: 'Test 1', hidden: true })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('option', { name: 'Test 2', hidden: true })[0]
    ).toBeInTheDocument();
  });

  it('calls the mutation when a lead has been selected', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowLeadColumn(true));
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const assignLead = screen.getAllByRole('option', {
      name: 'Test 2',
      hidden: true,
    })[0].parentElement;

    fireEvent.change(assignLead, { target: { value: 2 } });

    pageTestingHelper.expectMutationToBeCalled(
      'createApplicationAnalystLeadMutation',
      {
        input: {
          applicationAnalystLead: { analystId: 2, applicationId: 1 },
        },
      }
    );
  });

  it('has the correct received status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Received');

    expect(statusName).toHaveStyle('color: #FFFFFF');
    expect(statusName).toHaveStyle('background-color: #345FA9;');
  });

  it('has the correct approved status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Agreement signed');

    expect(statusName).toHaveStyle('color: #FFFFFF');
    expect(statusName).toHaveStyle('background-color: #1F8234;');
  });

  it('shows the internal and external status', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const internalStatus = screen.getByText('Received');
    const externalStatus = screen.getAllByText('Not selected')[0];

    expect(internalStatus).toBeInTheDocument();
    expect(externalStatus).toBeInTheDocument();
  });

  it('has the correct cancelled status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Cancelled');

    expect(statusName).toHaveStyle('color: #414141');
    expect(statusName).toHaveStyle('background-color: #E8E8E8;');
  });

  it('has the correct assessment status styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const statusName = screen.getByText('Assessment');

    expect(statusName).toHaveStyle('color: #003366');
    expect(statusName).toHaveStyle('background-color: #DBE6F0;');
  });

  it('displays the intake number', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const intakeIdCell = screen.getByText('2189');

    expect(intakeIdCell).toBeInTheDocument();
  });

  it('save the scroll position on page scroll', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    fireEvent.scroll(window, { target: { scrollY: 300 } });

    const sesstionStorage = window.sessionStorage.getItem(
      'dashboard_scroll_position'
    );

    expect(sesstionStorage).toBe('300');
  });

  it('save the user preference on column visibility on toggle', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const columnBtn = screen.getByTestId('ViewColumnIcon');
    await act(async () => {
      fireEvent.click(columnBtn);
    });

    const label = screen.getByLabelText('Lead');
    await act(async () => {
      fireEvent.click(label);
    });

    expect(cookie.set).toHaveBeenCalledWith(
      'mrt_show_lead_application',
      'true'
    );
  });

  it('scroll to previous location if session storage item exists', () => {
    window.sessionStorage.setItem('dashboard_scroll_position', '300');

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(window.scrollTo).toHaveBeenCalled();
    expect(window.scrollY).toBe(300);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('triggers the onChange event when the status dropdown is changed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const columnActions = document.querySelectorAll(
      '[aria-label="Show/Hide filters"]'
    )[0];

    await act(async () => {
      fireEvent.click(columnActions);
    });

    const statusDropdown = screen.getByLabelText(
      'Filter by Internal Status'
    ) as HTMLSelectElement;

    await act(async () => {
      fireEvent.keyDown(statusDropdown, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => {
      const option = screen.getByRole('option', { name: 'Received' });
      fireEvent.click(option);
    });

    const option = screen.getAllByText('Received')[0];
    expect(option).toBeInTheDocument();
  });
});
