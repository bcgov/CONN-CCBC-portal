import { mocked } from 'jest-mock';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import * as moduleApi from '@growthbook/growthbook-react';
import cookie from 'js-cookie';
import userEvent from '@testing-library/user-event';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import PageTestingHelper from '../../utils/pageTestingHelper';
import compileddashboardQuery, {
  dashboardAnalystQuery,
} from '../../../__generated__/dashboardAnalystQuery.graphql';
import Dashboard from '../../../pages/analyst/dashboard';

jest.setTimeout(10000);

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'super_admin',
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
              zones: [2, 3],
              program: 'CCBC',
              status: 'received',
              package: '1',
              applicationFormTemplate9DataByApplicationId: {
                nodes: [
                  {
                    jsonData: {
                      geoNames: [
                        {
                          mapLink: 'https://www.google.com/maps',
                          geoName: 'Test Geo Name',
                        },
                      ],
                    },
                  },
                ],
              },
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
              zone: 1,
              zones: [1],
              program: 'CCBC',
              status: 'approved',
              package: null,
              applicationFormTemplate9DataByApplicationId: {
                nodes: [
                  {
                    jsonData: {
                      geoNames: [
                        {
                          mapLink: 'https://www.google.com/maps',
                          geoName: 'Old Fort',
                        },
                      ],
                    },
                  },
                ],
              },
              applicationSowDataByApplicationId: {
                nodes: [
                  {
                    sowTab7SBySowId: {
                      nodes: [
                        {
                          rowId: 147,
                          jsonData: {
                            summaryTable: {
                              totalFNHAFunding: 0,
                              totalProjectCost: 9779464.57,
                              totalEligibleCosts: 9646591.57,
                              totalIneligibleCosts: 134107.57,
                              totalFundingRequestedCCBC: 7861234.57,
                              fundingFromAllOtherSources: 1234.57,
                              totalApplicantContribution: 1919464.57,
                              amountRequestedFromProvince: 7861234.57,
                              totalInfrastructureBankFunding: 1234.57,
                              amountRequestedFromFederalGovernment: 1234.57,
                              targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity: true,
                            },
                          },
                          sowId: 147,
                        },
                      ],
                    },
                    sowTab8SBySowId: {
                      nodes: [
                        {
                          jsonData: {
                            geoNames: [
                              {
                                bcGeoName: 'Bear Lake',
                                mapLink: 'https://www.google.com/maps',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
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
              program: 'CCBC',
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
              program: 'CCBC',
            },
          },
          {
            node: {
              id: '5',
              rowId: 5,
              analystStatus: 'complete',
              externalStatus: 'complete',
              projectName: 'Atlin',
              ccbcNumber: 'BC-000074',
              organizationName: 'Atlin',
              intakeNumber: 99,
              zone: null,
              zones: [],
              program: 'OTHER',
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
      allCbcData: {
        edges: [
          {
            node: {
              jsonData: {
                phase: 2,
                intake: 1,
                errorLog: [],
                highwayKm: null,
                projectType: 'Transport',
                reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
                transportKm: 124,
                lastReviewed: '2023-07-11T00:00:00.000Z',
                otherFundingRequested: 265000,
                projectTitle: 'Project 1',
                dateAnnounced: '2019-07-02T00:00:00.000Z',
                projectNumber: '5555',
                projectStatus: 'Reporting Complete',
                federalFundingRequested: 555555,
                householdCount: null,
                applicantAmount: 555555,
                bcFundingRequested: 5555555,
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
                conditionalApprovalLetterSent: 'YES',
                agreementSigned: 'YES',
              },
              projectNumber: '5555',
            },
          },
          {
            node: {
              jsonData: {
                phase: 2,
                intake: 1,
                errorLog: [],
                highwayKm: null,
                projectType: 'Transport',
                reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
                transportKm: 100,
                lastReviewed: '2023-07-11T00:00:00.000Z',
                otherFundingRequested: 444444,
                projectTitle: 'Project 1',
                dateAnnounced: '2019-07-02T00:00:00.000Z',
                projectNumber: '4444',
                projectStatus: 'Agreement Signed',
                federalFundingRequested: 444444,
                householdCount: null,
                applicantAmount: 444444,
                bcFundingRequested: 444444,
                projectLocations: 'Location 2',
                milestoneComments: 'Requested extension to March 31, 2024',
                proposedStartDate: '2020-07-01T00:00:00.000Z',
                primaryNewsRelease:
                  'https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html',
                projectDescription: 'Description 2',
                totalProjectBudget: 444444,
                announcedByProvince: 'YES',
                dateAgreementSigned: '2021-02-24T00:00:00.000Z',
                changeRequestPending: 'No',
                currentOperatingName: 'Internet company 2',
                federalFundingSource: 'ISED-CTI',
                transportProjectType: 'Fibre',
                indigenousCommunities: 5,
                proposedCompletionDate: '2023-03-31T00:00:00.000Z',
                constructionCompletedOn: null,
                dateApplicationReceived: null,
                reportingCompletionDate: null,
                applicantContractualName: 'Internet company 2',
                dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                eightThirtyMillionFunding: 'No',
                projectMilestoneCompleted: 0.5,
                communitiesAndLocalesCount: 5,
                connectedCoastNetworkDependant: 'NO',
                conditionalApprovalLetterSent: 'YES',
                agreementSigned: 'YES',
              },
              projectNumber: '4444',
            },
          },
          {
            node: {
              jsonData: {
                phase: 2,
                intake: 1,
                errorLog: [],
                highwayKm: null,
                projectType: 'Transport',
                reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
                transportKm: 99,
                lastReviewed: '2023-07-11T00:00:00.000Z',
                otherFundingRequested: 33333,
                projectTitle: 'Project 3',
                dateAnnounced: '2019-07-02T00:00:00.000Z',
                projectNumber: '3333',
                originalProjectNumber: 673829,
                projectStatus: 'Reporting Complete',
                federalFundingRequested: 333333,
                householdCount: null,
                applicantAmount: 33333,
                bcFundingRequested: 333333,
                projectLocations: 'Location 3',
                milestoneComments: 'Requested extension to March 31, 2024',
                proposedStartDate: '2020-07-01T00:00:00.000Z',
                primaryNewsRelease:
                  'https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html',
                projectDescription: 'Description 2',
                totalProjectBudget: 333333,
                announcedByProvince: 'YES',
                dateAgreementSigned: '2021-02-24T00:00:00.000Z',
                changeRequestPending: 'No',
                currentOperatingName: 'Internet company 3',
                federalFundingSource: 'ISED-CTI',
                transportProjectType: 'Fibre',
                indigenousCommunities: 3,
                proposedCompletionDate: '2023-03-31T00:00:00.000Z',
                constructionCompletedOn: null,
                dateApplicationReceived: null,
                reportingCompletionDate: null,
                applicantContractualName: 'Internet company 3',
                dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                eightThirtyMillionFunding: 'No',
                projectMilestoneCompleted: 0.5,
                communitiesAndLocalesCount: 5,
                connectedCoastNetworkDependant: 'NO',
                conditionalApprovalLetterSent: 'YES',
                agreementSigned: 'YES',
              },
              projectNumber: '3333',
              cbcByCbcId: {
                cbcProjectCommunitiesByCbcId: {
                  nodes: [
                    {
                      communitiesSourceDataByCommunitiesSourceDataId: {
                        bcGeographicName: 'Old Silver Valley',
                        mapLink:
                          'https://apps.gov.bc.ca/pub/bcgnws/names/24757.html',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');
window.scrollTo = jest.fn();

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () =>
      Promise.resolve(
        new Blob(['test content'], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      ),
  })
) as jest.Mock;

const mockShowLeadColumn = (
  value: boolean
): moduleApi.FeatureResult<boolean> => ({
  value,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_lead',
});

const mockShowCbcProjects = (
  value: boolean
): moduleApi.FeatureResult<boolean> => ({
  value,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_cbc_projects',
});

const mockFreezeHeader = (
  value: boolean
): moduleApi.FeatureResult<boolean> => ({
  value,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'freeze_dashboard_header',
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
    // MRT Virtualization
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500,
    });

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1000,
    });

    HTMLElement.prototype.getBoundingClientRect = () => {
      return {
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        bottom: 500,
        right: 1000,
      } as DOMRect;
    };

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
        destination: '/analyst?redirect=/analyst/dashboard',
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
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

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

  it('renders expand all and expand buttons and opens detail panel with communities data', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const expandAllButton = document.querySelector('[aria-label="Expand all"]');
    expect(expandAllButton).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('KeyboardDoubleArrowDownIcon'));

    expect(screen.getByText(/Test Geo Name/)).toBeInTheDocument();
    expect(screen.getByText(/Bear Lake/)).toBeInTheDocument();
    expect(screen.queryByText(/Old Fort/)).not.toBeInTheDocument();
    expect(screen.getByText(/Old Silver Valley/)).toBeInTheDocument();
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
    jest.spyOn(moduleApi, 'useFeature').mockImplementation((ruleId: string) => {
      if (ruleId === 'freeze_dashboard_header') {
        return mockFreezeHeader(false);
      }
      return mockShowCbcProjects(true);
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const countRows = screen.getAllByText(/Showing 8 of 8 rows/i);
    expect(countRows).toHaveLength(2);
  });

  it('remove bottom analyst table row counts when freeze dashboard header', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockImplementation((ruleId: string) => {
      if (ruleId === 'freeze_dashboard_header') {
        return mockFreezeHeader(true);
      }
      return mockShowCbcProjects(true);
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const countRows = screen.getAllByText(/Showing 8 of 8 rows/i);
    expect(countRows).toHaveLength(1);
  });

  it('click on table row leads to review page', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const row = screen.getAllByRole('row')[1];

    await userEvent.click(row);

    expect(pageTestingHelper.router.push).toHaveBeenCalledWith(
      '/analyst/application/1/summary'
    );
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

    const statusName = screen.getAllByText('Agreement signed')[0];

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

  it('shows the project type filters with default filters', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const ccbcFilterCheckbox = screen.getByTestId('programFilterCcbc');
    const cbcFilterCheckbox = screen.getByTestId('programFilterCbc');

    expect(ccbcFilterCheckbox).toBeInTheDocument();
    expect(cbcFilterCheckbox).toBeInTheDocument();

    expect(ccbcFilterCheckbox).toBeChecked();
    expect(cbcFilterCheckbox).toBeChecked();
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

  it('last visited row visible with virtualization', async () => {
    window.sessionStorage.setItem(
      'mrt_last_visited_row_application',
      JSON.stringify({ rowId: 4, isCcbc: true })
    );

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 80, // ~40px per row, fits only 2
    });
    HTMLElement.prototype.getBoundingClientRect = () => ({
      width: 1000,
      height: 80,
      top: 0,
      left: 0,
      bottom: 80,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010004')).toBeInTheDocument();
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

  it('correctly filters project type', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('5555')).toBeInTheDocument();
    expect(screen.queryByText('CCBC-010004')).toBeInTheDocument();
    expect(screen.queryByText('BC-000074')).toBeInTheDocument();
    const cbcFilterCheckbox = screen.getByTestId('programFilterCbc');
    const ccbcFilterCheckbox = screen.getByTestId('programFilterCcbc');
    const otherFilterCheckbox = screen.getByTestId('programFilterOther');
    expect(cbcFilterCheckbox).toBeChecked();
    expect(ccbcFilterCheckbox).toBeChecked();
    expect(otherFilterCheckbox).toBeChecked();

    await act(async () => {
      fireEvent.click(cbcFilterCheckbox);
    });
    expect(cbcFilterCheckbox).not.toBeChecked();

    expect(screen.queryByText('5555')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(ccbcFilterCheckbox);
    });
    expect(ccbcFilterCheckbox).not.toBeChecked();

    expect(screen.queryByText('CCBC-010004')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(otherFilterCheckbox);
    });
    expect(otherFilterCheckbox).not.toBeChecked();

    expect(screen.queryByText('BC-000074')).not.toBeInTheDocument();
  });

  it('clear filters correctly restore project type filter', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('5555')).toBeInTheDocument();
    const cbcFilterCheckbox = screen.getByTestId('programFilterCbc');
    expect(cbcFilterCheckbox).toBeChecked();

    await act(async () => {
      fireEvent.click(cbcFilterCheckbox);
    });
    expect(cbcFilterCheckbox).not.toBeChecked();

    expect(screen.queryByText('5555')).not.toBeInTheDocument();

    const clearFiltersBtn = screen.getByText('Clear Filtering');
    await act(async () => {
      fireEvent.click(clearFiltersBtn);
    });

    expect(cbcFilterCheckbox).toBeChecked();
    expect(screen.queryByText('5555')).toBeInTheDocument();
  });

  it('shows global filter and filters results based on input', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
    expect(screen.getByText('CCBC-010003')).toBeInTheDocument();

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    fireEvent.change(globalSearch, {
      target: { value: 'Test Proj Name 3' },
    });

    await waitFor(() => {
      expect(screen.queryByText('CCBC-010002')).not.toBeInTheDocument();
      expect(screen.getByText('CCBC-010003')).toBeInTheDocument();
    });
  });

  it('global filter correctly filters communities and expand the row with match highlighting', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    fireEvent.change(globalSearch, {
      target: { value: 'Bear Lake' },
    });

    await waitFor(() => {
      expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();
      expect(screen.getByText('CCBC-010002')).toBeInTheDocument();

      expect(screen.getByText('Bear Lake')).toHaveStyle(
        'background-color: #FCBA19'
      );
    });
  });

  it('renders global filter modes', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    const searchButton = screen.getByTestId('SearchIcon');
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent('Fuzzy');
    expect(menuItems[1]).toHaveTextContent('Contains');
    expect(menuItems[2]).toHaveTextContent('Starts With');
  });

  it('global filter filters based on selected mode', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('CCBC-010002')).toBeInTheDocument();

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    const searchButton = screen.getByTestId('SearchIcon');
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    const menuItems = screen.getAllByRole('menuitem');

    fireEvent.change(globalSearch, {
      target: { value: 'oae' },
    });

    await waitFor(() => {
      expect(screen.queryByText('CCBC-010001')).toBeInTheDocument();
      expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
    });

    fireEvent.click(menuItems[1]);

    fireEvent.change(globalSearch, {
      target: { value: 'oae' },
    });

    await waitFor(() => {
      expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();
      expect(screen.queryByText('CCBC-010002')).not.toBeInTheDocument();
    });
  });

  it('clear filters correctly clears global filter and restore data', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('5555')).toBeInTheDocument();
    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    fireEvent.change(globalSearch, {
      target: { value: 'Bear Lake' },
    });

    await waitFor(() => {
      expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();
    });

    const clearFiltersBtn = screen.getByText('Clear Filtering');
    await act(async () => {
      fireEvent.click(clearFiltersBtn);
    });

    expect(screen.queryByText('CCBC-010001')).toBeInTheDocument();
  });

  it('cbc statuses are duplicated for both analyst and external statuses', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('Reporting complete')).toHaveLength(6);
  });

  it('internal status filter works correctly on cbc projects', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('Reporting complete')).toHaveLength(6);
  });

  it('should correctly filter by package filter', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeVisible();
    expect(screen.getByText('CCBC-010002')).toBeVisible();

    const packageFilter = screen.getAllByText('Filter by Package')[0];

    expect(packageFilter).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(packageFilter, { key: 'Enter', code: 'Enter' });
    });

    const option = screen.getByRole('option', { name: 'Unassigned' });
    await act(async () => {
      fireEvent.click(option);
    });

    await waitFor(
      () => {
        expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
        expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should correctly filter by zone filter', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('CCBC-010001')).toBeVisible();
    expect(screen.getByText('CCBC-010002')).toBeVisible();

    const zoneFilter = screen.getAllByText('Filter by Zone')[0];

    expect(zoneFilter).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(zoneFilter, { key: 'Enter', code: 'Enter' });
    });

    const option = screen.getByRole('option', { name: '1' });
    await act(async () => {
      fireEvent.click(option);
    });

    await waitFor(
      () => {
        expect(screen.getByText('CCBC-010002')).toBeInTheDocument();
        expect(screen.queryByText('CCBC-010001')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should correctly filter the cbc projects by analyst status filter', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('4444')).toBeVisible();
    expect(screen.getByText('5555')).toBeVisible();

    const internalStatusFilter = screen.getAllByText(
      'Filter by Internal Status'
    )[0];

    await act(async () => {
      fireEvent.keyDown(internalStatusFilter, { key: 'Enter', code: 'Enter' });
    });

    const option = screen.getByRole('option', { name: 'Agreement signed' });
    await act(async () => {
      fireEvent.click(option);
    });

    waitFor(
      () => {
        expect(screen.getByText('4444')).toBeInTheDocument();
        expect(screen.queryByText('5555')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should trigger export when download button clicked', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const downloadButton = screen.getByTestId('download-dashboard-icon');
    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should trigger export when enter key pressed on download button', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const downloadButton = screen.getByTestId('download-dashboard-icon');
    await act(async () => {
      fireEvent.keyDown(downloadButton, { key: 'Enter', code: 'Enter' });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should open the create cbc modal when the create cbc icon is clicked', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const createCbcIcon = screen.getByTestId('create-cbc-dashboard-icon');
    await act(async () => {
      fireEvent.click(createCbcIcon);
    });

    expect(screen.getByTestId('create-cbc-form-modal')).toBeInTheDocument();
  });

  it('should open the create cbc modal when the enter key is pressed on the create cbc icon', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const createCbcIcon = screen.getByTestId('create-cbc-dashboard-icon');
    await act(async () => {
      fireEvent.keyDown(createCbcIcon, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByTestId('create-cbc-form-modal')).toBeInTheDocument();
  });

  it('should show errors when the create cbc form is submitted with empty fields', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const createCbcIcon = screen.getByTestId('create-cbc-dashboard-icon');
    await act(async () => {
      fireEvent.click(createCbcIcon);
    });

    const submitButton = screen.getByText('Save and Continue');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Project title is required')).toBeInTheDocument();
    expect(screen.getByText('External status is required')).toBeInTheDocument();
    expect(screen.getByText('Project type is required')).toBeInTheDocument();
  });

  it('should call fetch one time when the create cbc form is submitted with valid data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const createCbcIcon = screen.getByTestId('create-cbc-dashboard-icon');
    await act(async () => {
      fireEvent.click(createCbcIcon);
    });

    const projectIdInput = screen.getByLabelText('Project ID');
    const projectTitleInput = screen.getByLabelText('Project Title');
    const externalStatusInput = screen.getByLabelText('External Status');
    const projectTypeInput = screen.getByLabelText('Project Type');

    await act(async () => {
      fireEvent.change(projectIdInput, { target: { value: '1234' } });
      fireEvent.change(projectTitleInput, {
        target: { value: 'Test Project' },
      });
      fireEvent.change(externalStatusInput, {
        target: { value: 'Conditionally Approved' },
      });
      fireEvent.change(projectTypeInput, {
        target: { value: 'Transport' },
      });
    });

    const submitButton = screen.getByText('Save and Continue');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('filters the applications by original project number', async () => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockShowCbcProjects(true));

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const originalProjectNumber = 673829;

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    const searchButton = screen.getByTestId('SearchIcon');
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    fireEvent.change(globalSearch, {
      target: { value: originalProjectNumber },
    });

    await waitFor(() => {
      expect(
        screen.getByText(originalProjectNumber.toString())
      ).toBeInTheDocument();
    });
  });

  describe('Funding Source Column Tests', () => {
    it('displays funding source column in the table', async () => {
      pageTestingHelper.loadQuery();
      pageTestingHelper.renderPage();

      expect(screen.getByText('BC/ISED Funded')).toBeInTheDocument();
    });

    it('shows BC funding source for CBC projects with BC funding only', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Agreement Signed',
                      bcFundingRequested: 100000,
                      federalFundingRequested: 0,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('BC')).toBeInTheDocument();
    });

    it('shows ISED funding source for CBC projects with federal funding only', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Agreement Signed',
                      bcFundingRequested: 0,
                      federalFundingRequested: 100000,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('ISED')).toBeInTheDocument();
    });

    it('shows BC & ISED funding source for CBC projects with both funding sources', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Agreement Signed',
                      bcFundingRequested: 50000,
                      federalFundingRequested: 50000,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('BC & ISED')).toBeInTheDocument();
    });

    it('shows N/A funding source for withdrawn CBC projects', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [],
            },
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Withdrawn',
                      bcFundingRequested: 50000,
                      federalFundingRequested: 50000,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getAllByText('N/A')[0]).toBeInTheDocument();
    });

    it('shows TBD funding source for conditionally approved CBC projects', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Conditionally Approved',
                      bcFundingRequested: 50000,
                      federalFundingRequested: 50000,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getAllByText('TBD')[0]).toBeInTheDocument();
    });

    it('shows TBD funding source for CBC projects with no funding amounts', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allCbcData: {
              edges: [
                {
                  node: {
                    jsonData: {
                      projectStatus: 'Agreement Signed',
                      bcFundingRequested: 0,
                      federalFundingRequested: 0,
                      currentOperatingName: 'Test CBC Company',
                      projectTitle: 'Test CBC Project',
                    },
                    projectNumber: '1001',
                    cbcId: 1,
                    cbcByCbcId: {
                      cbcProjectCommunitiesByCbcId: {
                        nodes: [],
                      },
                    },
                  },
                },
              ],
            },
          };
        },
      };

      jest
        .spyOn(moduleApi, 'useFeature')
        .mockReturnValue(mockShowCbcProjects(true));

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getAllByText('TBD')[0]).toBeInTheDocument();
    });

    it('shows N/A funding source for withdrawn CCBC applications', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'withdrawn',
                    externalStatus: 'closed',
                    projectName: 'Test Withdrawn Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'withdrawn',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 0,
                      nodes: [],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('shows TBD funding source for early stage CCBC applications', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'received',
                    externalStatus: 'closed',
                    projectName: 'Test Early Stage Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'received',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 0,
                      nodes: [],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('TBD')).toBeInTheDocument();
    });

    it('shows N/A funding source for merged CCBC applications', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'merged',
                    externalStatus: 'closed',
                    projectName: 'Test Merged Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'merged',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 0,
                      nodes: [],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('shows TBD funding source for CCBC applications without SOW data', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'Test No SOW Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 0,
                      nodes: [],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('TBD')).toBeInTheDocument();
    });

    it('shows BC funding source for CCBC applications with BC funding only', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'Test BC Funding Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '1',
                          jsonData: {},
                          rowId: 1,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 1,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 100000,
                                    amountRequestedFromFederalGovernment: 0,
                                  },
                                },
                                sowId: 1,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('BC')).toBeInTheDocument();
    });

    it('shows ISED funding source for CCBC applications with federal funding only', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'Test Federal Funding Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '1',
                          jsonData: {},
                          rowId: 1,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 1,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 0,
                                    amountRequestedFromFederalGovernment: 100000,
                                  },
                                },
                                sowId: 1,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('ISED')).toBeInTheDocument();
    });

    it('shows BC & ISED funding source for CCBC applications with both funding sources', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'Test Both Funding Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '1',
                          jsonData: {},
                          rowId: 1,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 1,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 50000,
                                    amountRequestedFromFederalGovernment: 50000,
                                  },
                                },
                                sowId: 1,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('BC & ISED')).toBeInTheDocument();
    });

    it('shows TBD funding source for CCBC applications with no funding amounts in SOW', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'Test No Funding Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '1',
                          jsonData: {},
                          rowId: 1,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 1,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 0,
                                    amountRequestedFromFederalGovernment: 0,
                                  },
                                },
                                sowId: 1,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      expect(screen.getByText('TBD')).toBeInTheDocument();
    });

    it('can filter by funding source', async () => {
      const mockPayload = {
        ...mockQueryPayload,
        Query() {
          return {
            ...mockQueryPayload.Query(),
            allApplications: {
              edges: [
                {
                  node: {
                    id: '1',
                    rowId: 1,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'BC Funded Project',
                    ccbcNumber: 'CCBC-010001',
                    organizationName: 'Test Org 1',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '1',
                          jsonData: {},
                          rowId: 1,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 1,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 100000,
                                    amountRequestedFromFederalGovernment: 0,
                                  },
                                },
                                sowId: 1,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
                {
                  node: {
                    id: '2',
                    rowId: 2,
                    analystStatus: 'approved',
                    externalStatus: 'closed',
                    projectName: 'ISED Funded Project',
                    ccbcNumber: 'CCBC-010002',
                    organizationName: 'Test Org 2',
                    intakeNumber: 1,
                    zones: [1],
                    program: 'CCBC',
                    status: 'approved',
                    package: '1',
                    applicationSowDataByApplicationId: {
                      totalCount: 1,
                      nodes: [
                        {
                          id: '2',
                          jsonData: {},
                          rowId: 2,
                          sowTab7SBySowId: {
                            nodes: [
                              {
                                rowId: 2,
                                jsonData: {
                                  summaryTable: {
                                    amountRequestedFromProvince: 0,
                                    amountRequestedFromFederalGovernment: 100000,
                                  },
                                },
                                sowId: 2,
                              },
                            ],
                          },
                          sowTab8SBySowId: {
                            nodes: [],
                          },
                        },
                      ],
                    },
                    applicationFormTemplate9DataByApplicationId: {
                      nodes: [],
                    },
                  },
                },
              ],
            },
          };
        },
      };

      pageTestingHelper.loadQuery(mockPayload);
      pageTestingHelper.renderPage();

      // Initially both projects should be visible
      expect(screen.getByText('BC Funded Project')).toBeInTheDocument();
      expect(screen.getByText('ISED Funded Project')).toBeInTheDocument();

      // Filter by BC funding
      const fundingSourceFilter = screen.getByLabelText(
        'Filter by BC/ISED Funded'
      );
      await act(async () => {
        fireEvent.mouseDown(fundingSourceFilter);
      });

      await waitFor(() => {
        const bcOption = screen.getByRole('option', { name: 'BC' });
        expect(bcOption).toBeInTheDocument();
      });

      const bcOption = screen.getByRole('option', { name: 'BC' });
      await act(async () => {
        fireEvent.click(bcOption);
      });

      // Click away to close the dropdown
      await act(async () => {
        fireEvent.click(document.body);
      });

      // Only BC funded project should be visible
      await waitFor(() => {
        expect(screen.getByText('BC Funded Project')).toBeInTheDocument();
        expect(
          screen.queryByText('ISED Funded Project')
        ).not.toBeInTheDocument();
      });
    });
  });
});
