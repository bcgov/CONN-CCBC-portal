import { act, screen } from '@testing-library/react';
import Summary from 'pages/analyst/application/[applicationId]/summary';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledSummaryQuery, {
  summaryQuery,
} from '__generated__/summaryQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        rowId: 1,
        ccbcNumber: 'CCBC-010001',
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockQueryPayloadReceived = {
  Query() {
    return {
      applicationByRowId: {
        announcements: {
          totalCount: 3,
        },
        formData: {
          jsonData: {
            review: {
              acknowledgeIncomplete: true,
            },
            benefits: {
              projectBenefits:
                "Test project benefits. This is a test project's benefits.",
              numberOfHouseholds: 31,
              householdsImpactedIndigenous: 0,
            },

            projectPlan: {
              operationalPlan:
                'Test operational plan. This is a test operational plan.',
              projectStartDate: '2023-01-01',
              projectCompletionDate: '2024-01-01',
            },
            budgetDetails: {
              totalProjectCost: 111,
              totalEligibleCosts: 222,
            },
            projectFunding: {
              fundingRequestedCCBC2324: 111,
              fundingRequestedCCBC2425: 222,
              totalFundingRequestedCCBC: 333,
              totalApplicantContribution: 444,
              applicationContribution2324: 555,
              applicationContribution2425: 666,
            },
            alternateContact: {},
            authorizedContact: {},
            contactInformation: {},
            projectInformation: {
              projectTitle: 'Test project title',
              projectDescription:
                'Test project description. This is a test project description.',
              geographicAreaDescription:
                'Test geographic area description. This is a test geographic area description.',
            },
            organizationProfile: {},
            otherFundingSources: {
              otherFundingSources: true,
              otherFundingSourcesArray: [
                {
                  funderType: 'Provincial/territorial',
                  statusOfFunding: 'Submitted',
                  fundingPartnersName:
                    'Test funding partner name. This is a test funding partner name.',
                  nameOfFundingProgram: 'Test',
                  fundingSourceContactInfo: 'Test',
                  requestedFundingPartner2324: 777,
                  requestedFundingPartner2425: 888,
                  totalRequestedFundingPartner: 999,
                },
              ],
              totalInfrastructureBankFunding: null,
            },
            supportingDocuments: {},
            organizationLocation: {},
            existingNetworkCoverage: {},
            estimatedProjectEmployment: {
              currentEmployment: 1,
              estimatedFTECreation: 1.1,
              numberOfEmployeesToWork: 1,
              personMonthsToBeCreated: 1,
              hoursOfEmploymentPerWeek: 10,
              numberOfContractorsToWork: 1,
              estimatedFTEContractorCreation: 1.4,
              contractorPersonMonthsToBeCreated: 1,
              hoursOfContractorEmploymentPerWeek: 11,
            },
          },
        },
        projectInformation: {},
        applicationMilestoneExcelDataByApplicationId: {
          nodes: [],
        },
        conditionalApproval: {},
        changeRequestDataByApplicationId: {},
        status: 'received',
        allAssessments: {
          nodes: [],
        },
        intakeNumber: 1,
      },
      allApplicationSowData: {
        nodes: [],
      },
      allIntakes: {
        nodes: [
          {
            closeTimestamp: '2022-12-15T22:30:00+00:00',
            ccbcIntakeNumber: 1,
          },
          {
            closeTimestamp: '2023-02-16T22:30:00+00:00',
            ccbcIntakeNumber: 2,
          },
          {
            closeTimestamp: '2027-04-01T06:59:59+00:00',
            ccbcIntakeNumber: 99,
          },
          {
            closeTimestamp: '2024-03-14T21:30:00+00:00',
            ccbcIntakeNumber: 3,
          },
          {
            closeTimestamp: '2024-06-20T21:30:00+00:00',
            ccbcIntakeNumber: 4,
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockQueryPayloadConditionalApproval = {
  Query() {
    return {
      applicationByRowId: {
        announcements: {
          totalCount: 3,
        },
        formData: {
          jsonData: {
            review: {
              acknowledgeIncomplete: true,
            },
            benefits: {
              projectBenefits:
                "Test project benefits. This is a test project's benefits.",
              numberOfHouseholds: 31,
              householdsImpactedIndigenous: 0,
            },

            projectPlan: {
              operationalPlan:
                'Test operational plan. This is a test operational plan.',
              projectStartDate: '2023-01-01',
              projectCompletionDate: '2024-01-01',
            },
            budgetDetails: {
              totalProjectCost: 111,
              totalEligibleCosts: 222,
            },
            projectFunding: {
              fundingRequestedCCBC2324: 111,
              fundingRequestedCCBC2425: 222,
              totalFundingRequestedCCBC: 333,
              totalApplicantContribution: 444,
              applicationContribution2324: 555,
              applicationContribution2425: 666,
            },
            alternateContact: {},
            authorizedContact: {},
            contactInformation: {},
            projectInformation: {
              projectTitle: 'Test project title',
              projectDescription:
                'Test project description. This is a test project description.',
              geographicAreaDescription:
                'Test geographic area description. This is a test geographic area description.',
            },
            organizationProfile: {},
            otherFundingSources: {
              otherFundingSources: true,
              otherFundingSourcesArray: [
                {
                  funderType: 'Provincial/territorial',
                  statusOfFunding: 'Submitted',
                  fundingPartnersName:
                    'Test funding partner name. This is a test funding partner name.',
                  nameOfFundingProgram: 'Test',
                  fundingSourceContactInfo: 'Test',
                  requestedFundingPartner2324: 777,
                  requestedFundingPartner2425: 888,
                  totalRequestedFundingPartner: 999,
                },
              ],
              totalInfrastructureBankFunding: null,
            },
            supportingDocuments: {},
            organizationLocation: {},
            existingNetworkCoverage: {},
            estimatedProjectEmployment: {
              currentEmployment: 1,
              estimatedFTECreation: 1.1,
              numberOfEmployeesToWork: 1,
              personMonthsToBeCreated: 1,
              hoursOfEmploymentPerWeek: 10,
              numberOfContractorsToWork: 1,
              estimatedFTEContractorCreation: 1.4,
              contractorPersonMonthsToBeCreated: 1,
              hoursOfContractorEmploymentPerWeek: 11,
            },
          },
        },
        projectInformation: {},
        applicationMilestoneExcelDataByApplicationId: {
          nodes: [],
        },
        conditionalApproval: {
          jsonData: {
            decision: {
              ministerDate: '2023-04-18',
              ministerDecision: 'Approved',
              provincialRequested: 1234,
            },
            response: {
              applicantResponse: 'Accepted',
              statusApplicantSees: 'Conditionally Approved',
            },
            isedDecisionObj: {
              isedDate: '2023-05-02',
              isedDecision: 'Approved',
              federalRequested: 4567,
              isedAnnouncement: 'Hold announcement',
            },
            letterOfApproval: {
              letterOfApprovalDateSent: '2023-05-27',
            },
          },
        },
        changeRequestDataByApplicationId: {},
        status: 'conditionally_approved',
        allAssessments: {
          nodes: [],
        },
        intakeNumber: 1,
      },
      allApplicationSowData: {
        nodes: [],
      },
      allIntakes: {
        nodes: [
          {
            closeTimestamp: '2022-12-15T22:30:00+00:00',
            ccbcIntakeNumber: 1,
          },
          {
            closeTimestamp: '2023-02-16T22:30:00+00:00',
            ccbcIntakeNumber: 2,
          },
          {
            closeTimestamp: '2027-04-01T06:59:59+00:00',
            ccbcIntakeNumber: 99,
          },
          {
            closeTimestamp: '2024-03-14T21:30:00+00:00',
            ccbcIntakeNumber: 3,
          },
          {
            closeTimestamp: '2024-06-20T21:30:00+00:00',
            ccbcIntakeNumber: 4,
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockQueryPayloadAgreementSigned = {
  Query() {
    return {
      applicationByRowId: {
        announcements: {
          totalCount: 3,
        },
        formData: {
          jsonData: {
            review: {
              acknowledgeIncomplete: true,
            },
            benefits: {
              projectBenefits:
                "Test project benefits. This is a test project's benefits.",
              numberOfHouseholds: 31,
              householdsImpactedIndigenous: 0,
            },

            projectPlan: {
              operationalPlan:
                'Test operational plan. This is a test operational plan.',
              projectStartDate: '2023-01-01',
              projectCompletionDate: '2024-01-01',
            },
            budgetDetails: {
              totalProjectCost: 111,
              totalEligibleCosts: 222,
            },
            projectFunding: {
              fundingRequestedCCBC2324: 111,
              fundingRequestedCCBC2425: 222,
              totalFundingRequestedCCBC: 333,
              totalApplicantContribution: 444,
              applicationContribution2324: 555,
              applicationContribution2425: 666,
            },
            alternateContact: {},
            authorizedContact: {},
            contactInformation: {},
            projectInformation: {
              projectTitle: 'Test project title',
              projectDescription:
                'Test project description. This is a test project description.',
              geographicAreaDescription:
                'Test geographic area description. This is a test geographic area description.',
            },
            organizationProfile: {},
            otherFundingSources: {
              otherFundingSources: true,
              otherFundingSourcesArray: [
                {
                  funderType: 'Provincial/territorial',
                  statusOfFunding: 'Submitted',
                  fundingPartnersName:
                    'Test funding partner name. This is a test funding partner name.',
                  nameOfFundingProgram: 'Test',
                  fundingSourceContactInfo: 'Test',
                  requestedFundingPartner2324: 777,
                  requestedFundingPartner2425: 888,
                  totalRequestedFundingPartner: 999,
                },
              ],
              totalInfrastructureBankFunding: null,
            },
            supportingDocuments: {},
            organizationLocation: {},
            existingNetworkCoverage: {},
            estimatedProjectEmployment: {
              currentEmployment: 1,
              estimatedFTECreation: 1.1,
              numberOfEmployeesToWork: 1,
              personMonthsToBeCreated: 1,
              hoursOfEmploymentPerWeek: 10,
              numberOfContractorsToWork: 1,
              estimatedFTEContractorCreation: 1.4,
              contractorPersonMonthsToBeCreated: 1,
              hoursOfContractorEmploymentPerWeek: 11,
            },
          },
        },
        projectInformation: {
          jsonData: {
            dateFundingAgreementSigned: '2023-12-02',
            hasFundingAgreementBeenSigned: true,
          },
        },
        applicationMilestoneExcelDataByApplicationId: {
          nodes: [
            {
              jsonData: {
                projectNumber: 'CCBC-010001',
                milestone1Progress: 0.6666666666666666,
                milestone2Progress: 0,
                milestone3Progress: 0,
                milestone1ProjectSites: [
                  {
                    isPOP: '',
                    siteId: '',
                    projectSite: '',
                    milestoneOneDueDate: '',
                  },
                ],
                milestone2ProjectSites: [
                  {
                    isPOP: '',
                    siteId: '',
                    projectSite: '',
                    detailedProgress: {
                      landAccessPermitEvidence: {
                        progress: 0,
                      },
                      radioAndSpectrumLicenses: {
                        progress: 0,
                      },
                      photographsOfProjectSites: {
                        progress: 0,
                      },
                      pointOfPresenceConfirmation: {
                        progress: 0,
                      },
                    },
                    milestoneTwoDueDate: '',
                  },
                ],
                overallMilestoneProgress: 0.24,
                milestone1DateOfReception: '2024-04-10T00:00:00.000Z',
                milestone2DateOfReception: '',
              },
            },
          ],
        },
        conditionalApproval: {
          jsonData: {
            decision: {
              ministerDate: '2023-04-18',
              ministerDecision: 'Approved',
              provincialRequested: 555,
            },
            response: {
              applicantResponse: 'Accepted',
              statusApplicantSees: 'Conditionally Approved',
            },
            isedDecisionObj: {
              isedDate: '2023-05-02',
              isedDecision: 'Approved',
              federalRequested: 555,
              isedAnnouncement: 'Hold announcement',
            },
            letterOfApproval: {
              letterOfApprovalDateSent: '2023-05-27',
            },
          },
        },
        changeRequestDataByApplicationId: {},
        status: 'applicant_approved',
        allAssessments: {
          nodes: [
            {
              assessmentDataType: 'screening',
              jsonData: {
                decision: 'Eligible',
                nextStep: 'Assessment complete',
                assignedTo: 'Someone',
                targetDate: '2023-01-09',
                contestingMap: ['Applicant is contesting the area map'],
                crtcProjectDependent: true,
                connectedCoastNetworkDependent: true,
              },
            },
          ],
        },
        intakeNumber: 1,
      },
      allApplicationSowData: {
        nodes: [
          {
            rowId: 4,
            jsonData: {
              province: 'BC',
              ccbc_number: 'CCBC-010001',
              lastMileDSL: false,
              projectTitle: 'Test',
              backboneFibre: false,
              lastMileCable: false,
              lastMileFibre: true,
              organizationName: 'Test',
              projectStartDate: '2023-08-02T00:00:00.000Z',
              backboneMicrowave: false,
              backboneSatellite: false,
              lastMileSatellite: false,
              effectiveStartDate: '2023-06-02T00:00:00.000Z',
              lastMileFixedWireless: false,
              projectCompletionDate: '2024-12-01T00:00:00.000Z',
              lastMileMobileWireless: false,
            },
            sowTab1SBySowId: {
              nodes: [
                {
                  jsonData: {
                    numberOfHouseholds: 4,
                    householdsImpactedIndigenous: 0,
                    totalNumberCommunitiesImpacted: 3,
                  },
                  rowId: 4,
                  sowId: 4,
                },
              ],
            },
            sowTab2SBySowId: {},
            sowTab7SBySowId: {
              nodes: [
                {
                  jsonData: {
                    summaryTable: {
                      totalProjectCost: 4444,
                      totalEligibleCosts: 3333,
                      totalIneligibleCosts: 2222,
                      totalFundingRequestedCCBC: 1111,
                      fundingFromAllOtherSources: 9999,
                      totalApplicantContribution: 8888,
                      amountRequestedFromProvince: 7777,
                      totalInfrastructureBankFunding: 6666,
                      amountRequestedFromFederalGovernment: 5555,
                      targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity:
                        false,
                    },
                    detailedBudget: {
                      federalSharingRatio: 0.4,
                      provincialSharingRatio: 0.4,
                    },
                    summaryOfEstimatedProjectCosts: {
                      projectCosts: {
                        totalProjectCost: {
                          '2324': 17,
                          '2425': 13,
                          '2526': 0,
                          '2627': 0,
                          total: 30,
                        },
                        totalEligibleCosts: {
                          '2324': 17,
                          '2425': 13,
                          '2526': 0,
                          '2627': 0,
                          total: 30,
                        },
                        totalIneligibleCosts: {
                          '2324': 17,
                          '2425': 13,
                          '2526': 0,
                          '2627': 0,
                          total: 30,
                        },
                      },
                      estimatedProjectCosts: {
                        eligibleMobile: 0,
                        totalProjectCost: 30,
                        totalEligibleCosts: 26,
                        totalIneligibleCosts: 45,
                        eligibleRuralBroadband: 26,
                        eligibleVeryRemoteSatelliteIndigenousBroadband: 0,
                      },
                      totalCostsPerCostCategory: {},
                      thirtyPercentOfTotalEligibleCosts: 79,
                    },
                    summaryOfEstimatedProjectFunding: {},
                    currentFiscalProvincialContributionForecastByQuarter: {},
                  },
                  rowId: 4,
                  sowId: 4,
                },
              ],
            },
            sowTab8SBySowId: {
              nodes: [
                {
                  rowId: 4,
                  jsonData: {
                    geoNames: [
                      {
                        geoType: 'Locality',
                        mapLink: 'https://test.gov.bc.ca',
                        impacted: 'Yes',
                        latitude: 0,
                        bcGeoName: 'Here',
                        geoNameId: 0,
                        longitude: 0,
                        indigenous: 'Y',
                        projectZone: 9,
                      },
                      {
                        geoType: 'Community',
                        mapLink: 'https://test.gov.bc.ca',
                        impacted: 'Yes',
                        latitude: 0,
                        bcGeoName: 'Somewhere',
                        geoNameId: 0,
                        longitude: 0,
                        indigenous: 'N',
                        projectZone: 9,
                      },
                      {
                        geoType: 'Village',
                        mapLink: 'https://test.gov.bc.ca',
                        impacted: 'Yes',
                        latitude: 0,
                        bcGeoName: 'Village',
                        geoNameId: 0,
                        longitude: 0,
                        indigenous: 'N',
                        projectZone: 9,
                      },
                      {
                        geoType: 'Community',
                        mapLink: 'https://test.gov.bc.ca',
                        impacted: 'Yes',
                        latitude: 0,
                        bcGeoName: 'Community',
                        geoNameId: 0,
                        longitude: 0,
                        indigenous: 'N',
                        projectZone: 9,
                      },
                    ],
                    communitiesNumber: 4,
                    indigenousCommunitiesNumber: 0,
                  },
                  sowId: 4,
                },
              ],
            },
          },
        ],
      },
      allIntakes: {
        nodes: [
          {
            closeTimestamp: '2022-12-15T22:30:00+00:00',
            ccbcIntakeNumber: 1,
          },
          {
            closeTimestamp: '2023-02-16T22:30:00+00:00',
            ccbcIntakeNumber: 2,
          },
          {
            closeTimestamp: '2027-04-01T06:59:59+00:00',
            ccbcIntakeNumber: 99,
          },
          {
            closeTimestamp: '2024-03-14T21:30:00+00:00',
            ccbcIntakeNumber: 3,
          },
          {
            closeTimestamp: '2024-06-20T21:30:00+00:00',
            ccbcIntakeNumber: 4,
          },
        ],
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<summaryQuery>({
  pageComponent: Summary,
  compiledQuery: compiledSummaryQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

jest.setTimeout(10000000);

describe('The Summary page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the summary page headings', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery();
      pageTestingHelper.renderPage();
    });

    expect(screen.getByText('Dependency')).toBeInTheDocument();
    expect(screen.getByText('Counts')).toBeInTheDocument();
    expect(screen.getByText('Funding')).toBeInTheDocument();
    expect(screen.getByText('Events and Dates')).toBeInTheDocument();
    expect(screen.getByText('Milestone')).toBeInTheDocument();
  });

  it('should show the correct data when application is received', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadReceived);
      pageTestingHelper.renderPage();
    });

    // households
    expect(screen.getByText('31')).toBeInTheDocument();
    // start date
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    // date received (intake closing)
    expect(screen.getByText('2022-12-15')).toBeInTheDocument();
    // application source
    expect(screen.getAllByText('(Application)')).toHaveLength(7);
  });

  it('should show the correct data when application is conditional approval', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadConditionalApproval);
      pageTestingHelper.renderPage();
    });

    // bc funding requested
    expect(screen.getByText('$1,234')).toBeInTheDocument();
    // federal funding requested
    expect(screen.getByText('$4,567')).toBeInTheDocument();
    // date conditional approved
    expect(screen.getByText('2023-05-02')).toBeInTheDocument();
    // conditional approval
    expect(screen.getAllByText('(Conditional Approval)')).toHaveLength(3);
  });

  it('should show the correct data when application is agreement signed', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadAgreementSigned);
      pageTestingHelper.renderPage();
    });

    // benefiting communities
    expect(screen.getByText('Somewhere')).toBeInTheDocument();
    // benefiting indigenous communities
    expect(screen.getByText('Here')).toBeInTheDocument();
    // milestone
    expect(screen.getByText('24%')).toBeInTheDocument();
    // application source
    expect(screen.getAllByText('(SOW)')).toHaveLength(15);
  });
});
