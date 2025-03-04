import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import Summary from 'pages/analyst/application/[applicationId]/summary';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledSummaryQuery, {
  summaryQuery,
} from '__generated__/summaryQuery.graphql';
import * as moduleApi from '@growthbook/growthbook-react';

const mockShowSummaryMap: moduleApi.FeatureResult<boolean> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_summary_map',
};

const fakeMarkerData = {
  coordinates: [49.2827, -123.1207],
  name: 'Test Marker',
  description: 'This is a test marker.',
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'red',
    icon: 'marker-icon.png',
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
  balloonData: '<div><h1>Test Marker</h1><p>This is a test marker.</p></div>',
};

const fakePolygonData = {
  coordinates: [
    [
      [49.2827, -123.1207],
      [49.2828, -123.1208],
      [49.2829, -123.1209],
      [49.2827, -123.1207],
    ],
  ],
  name: 'Test Polygon',
  description: 'This is a test polygon.',
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'blue',
    fillColor: 'lightblue',
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
  balloonData: '<div><h1>Test Polygon</h1><p>This is a test polygon.</p></div>',
};

const fakeLineStringData = {
  coordinates: [
    [
      [49.2827, -123.1207],
      [49.2828, -123.1208],
      [49.2829, -123.1209],
    ],
  ],
  name: 'Test LineString',
  description: 'This is a test line string.',
  // extendedData: {
  //   key1: 'value1',
  //   key2: 'value2',
  // },
  style: {
    color: 'green',
    weight: 2,
  },
  fileName: 'test-file.kml',
  source: 'Test Source',
};

const fakeParsedKML = {
  polygons: [fakePolygonData],
  markers: [fakeMarkerData],
  lineStrings: [fakeLineStringData],
  bounds: [
    [49.2827, -123.1207],
    [49.2829, -123.1209],
  ],
  center: [49.2828, -123.1208],
  fileName: 'test-file.kml',
  source: 'Test Source',
};

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
        applicationDependenciesByApplicationId: {
          nodes: [
            {
              jsonData: {
                connectedCoastNetworkDependent: 'Yes',
                connectedCoastNetworkDependentDetails: 'TBD',
              },
            },
          ],
        },
        applicationFnhaContributionsByApplicationId: {
          edges: [
            {
              node: {
                id: '1',
                fnhaContribution: 10000,
              },
            },
          ],
        },
        applicationFormTemplate9DataByApplicationId: {
          nodes: [
            {
              jsonData: {
                geoNames: [
                  {
                    type: 'Locality',
                    geoName: 'Echo Bay',
                    mapLink:
                      'https://apps.gov.bc.ca/pub/bcgnws/names/26059.html',
                    geoNameId: 26,
                    households: 96,
                    projectZone: 6,
                    isIndigenous: 'N',
                    economicRegion: 'Vancouver Island and Coast',
                    proposedSolution: 'Fibre-Optic',
                    regionalDistrict: 'Regional District of Mount Waddington',
                    pointOfPresenceId: 'Connected Coast Echo Bay',
                  },
                  {
                    type: 'Indian Reserve',
                    geoName: 'Gwayasdums 1',
                    mapLink:
                      'https://apps.gov.bc.ca/pub/bcgnws/names/65365.html',
                    geoNameId: 65,
                    households: 55,
                    projectZone: 6,
                    isIndigenous: 'Y',
                    economicRegion: 'Vancouver Island and Coast',
                    proposedSolution: 'Fibre-Optic',
                    regionalDistrict: 'Regional District of Mount Waddington',
                    pointOfPresenceId: 'Connected Coast Health Bay',
                  },
                ],
                communitiesToBeServed: 2,
                totalNumberOfHouseholds: 151,
                indigenousCommunitiesToBeServed: 1,
                totalNumberOfIndigenousHouseholds: 55,
              },
              source: {
                uuid: '5ac1187a-f5ea-44fb-9999-ffffffff',
                source: 'application',
              },
            },
          ],
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

const mockQueryPayloadReceivedWithoutTemplate9 = {
  Query() {
    return {
      allApplicationErs: { edges: [] },
      allApplicationRds: { edges: [] },
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
        applicationDependenciesByApplicationId: {
          nodes: [
            {
              jsonData: {
                connectedCoastNetworkDependent: 'Yes',
                connectedCoastNetworkDependentDetails: 'TBD',
              },
            },
          ],
        },
        applicationFormTemplate9DataByApplicationId: {
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

const mockQueryPayloadReceivedTemplate9EmptyGeoNames = {
  Query() {
    return {
      ...mockQueryPayloadReceivedWithoutTemplate9.Query(),
      applicationByRowId: {
        ...mockQueryPayloadReceivedWithoutTemplate9.Query().applicationByRowId,
        applicationFormTemplate9DataByApplicationId: {
          nodes: [
            {
              jsonData: {
                geoNames: [],
                communitiesToBeServed: 0,
                totalNumberOfHouseholds: 0,
                indigenousCommunitiesToBeServed: 0,
                totalNumberOfIndigenousHouseholds: 0,
              },
              source: {
                date: '2025-01-13T10:23:17.198-08:00',
                source: 'rfi',
                fileName: 'Template 9 - Geographic Names.xlsx',
                rfiNumber: 'CCBC-060081-2',
              },
              id: 'WyJhcHBsaWNhdGlvbl9mb3JtX3RlbXBsYXRlXzlfZGF0YSIsMTE5XQ==',
            },
          ],
        },
      },
    };
  },
};

const payloadConditionalApproval = {
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
    applicationFormTemplate9DataByApplicationId: {
      nodes: [
        {
          jsonData: {
            geoNames: [
              {
                type: 'Locality',
                geoName: 'Echo Bay',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/26059.html',
                geoNameId: 26,
                households: 96,
                projectZone: 6,
                isIndigenous: 'N',
                economicRegion: 'Vancouver Island and Coast',
                proposedSolution: 'Fibre-Optic',
                regionalDistrict: 'Regional District of Mount Waddington',
                pointOfPresenceId: 'Connected Coast Echo Bay',
              },
              {
                type: 'Indian Reserve',
                geoName: 'Gwayasdums 1',
                mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/65365.html',
                geoNameId: 65,
                households: 55,
                projectZone: 6,
                isIndigenous: 'Y',
                economicRegion: 'Vancouver Island and Coast',
                proposedSolution: 'Fibre-Optic',
                regionalDistrict: 'Regional District of Mount Waddington',
                pointOfPresenceId: 'Connected Coast Health Bay',
              },
            ],
            communitiesToBeServed: 2,
            totalNumberOfHouseholds: 151,
            indigenousCommunitiesToBeServed: 1,
            totalNumberOfIndigenousHouseholds: 55,
          },
          source: {
            uuid: '5ac1187a-f5ea-44fb-9999-ffffffff',
            source: 'rfi',
            rfiNumber: 'CCBC-0001-1',
          },
        },
      ],
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

const mockQueryPayloadConditionalApprovalNoFunding = {
  Query() {
    return {
      ...payloadConditionalApproval,
      applicationByRowId: {
        ...payloadConditionalApproval.applicationByRowId,
        conditionalApproval: {
          jsonData: {
            ...payloadConditionalApproval.applicationByRowId.conditionalApproval
              .jsonData,
            decision: {
              ministerDate: '2023-04-18',
              ministerDecision: 'Approved',
            },
            isedDecisionObj: {
              isedDate: '2023-05-02',
              isedDecision: 'Approved',
              isedAnnouncement: 'Hold announcement',
            },
          },
        },
      },
    };
  },
};

const mockQueryPayloadConditionalApprovalBcFunding = {
  Query() {
    return {
      ...payloadConditionalApproval,
      applicationByRowId: {
        ...payloadConditionalApproval.applicationByRowId,
        conditionalApproval: {
          jsonData: {
            ...payloadConditionalApproval.applicationByRowId.conditionalApproval
              .jsonData,
            decision: {
              ministerDate: '2023-04-18',
              ministerDecision: 'Approved',
              provincialRequested: 1234,
            },
            isedDecisionObj: {
              isedDate: '2023-05-02',
              isedDecision: 'Approved',
              isedAnnouncement: 'Hold announcement',
            },
          },
        },
      },
    };
  },
};

const mockQueryPayloadConditionalApproval = {
  Query() {
    return payloadConditionalApproval;
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
              assessmentDataType: 'technical',
              jsonData: {
                decision: 'Eligible',
                nextStep: 'Assessment complete',
                assignedTo: 'Someone',
                targetDate: '2023-01-09',
              },
            },
          ],
        },
        intakeNumber: 1,
      },
      allApplicationSowData: {
        nodes: [
          {
            amendmentNumber: 1,
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
                    indigenousCommunitiesNumber: 1,
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

const mockQueryPayloadAgreementSignedMissingSow = {
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
        applicationDependenciesByApplicationId: {
          nodes: [
            {
              jsonData: {
                connectedCoastNetworkDependent: 'Yes',
                connectedCoastNetworkDependentDetails: 'TBD',
              },
            },
          ],
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
              assessmentDataType: 'technical',
              jsonData: {
                decision: 'Eligible',
                nextStep: 'Assessment complete',
                assignedTo: 'Someone',
                targetDate: '2023-01-09',
              },
            },
          ],
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
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowSummaryMap);
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeParsedKML),
      })
    );
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
    // fnha Contribution
    expect(screen.getByText('$10,000')).toBeInTheDocument();
    // application source
    expect(screen.getAllByText('(Application)')).toHaveLength(8);
  });

  it('should show the reason for blanks for locations when template 9 not uploaded when application status is received', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadReceivedWithoutTemplate9);
      pageTestingHelper.renderPage();
    });

    const benefitingIndigenousCommunities = screen.getByTestId(
      'root_locations_benefitingIndigenousCommunities-value'
    );
    expect(benefitingIndigenousCommunities).toHaveTextContent('N/A');
    const helpIcon1 = benefitingIndigenousCommunities.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon1).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon1);
    const tooltip1 = await screen.findByText(
      /This value is informed from Template 9 which has not been received from the applicant./
    );
    expect(tooltip1).toBeInTheDocument();

    const benefitingCommunities = screen.getByTestId(
      'root_locations_benefitingCommunities-value'
    );
    expect(benefitingCommunities).toHaveTextContent('N/A');

    const helpIcon2 = benefitingCommunities.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon2).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(
      /This value is informed from Template 9 which has not been received from the applicant./
    );
    expect(tooltip2).toBeInTheDocument();
  });

  it('should show correct values when application status is received and template 9 does not have location data', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(
        mockQueryPayloadReceivedTemplate9EmptyGeoNames
      );
      pageTestingHelper.renderPage();
    });

    const benefitingIndigenousCommunities = screen.getByTestId(
      'root_locations_benefitingIndigenousCommunities-value'
    );
    expect(benefitingIndigenousCommunities).toHaveTextContent('None');
    const helpIcon1 = benefitingIndigenousCommunities.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon1).not.toBeInTheDocument();

    const benefitingCommunities = screen.getByTestId(
      'root_locations_benefitingCommunities-value'
    );
    expect(benefitingCommunities).toHaveTextContent('None');
  });

  it('should show the reason for blanks for locations when shp file uploaded but no data found', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadReceivedWithoutTemplate9);
      pageTestingHelper.renderPage();
    });

    const ers = screen.getByTestId('root_locations_economicRegions-value');
    expect(ers).toHaveTextContent('TBD');
    const helpIcon1 = ers.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon1).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon1);
    const tooltip1 = await screen.findByText(
      /Coverage data requires updating in the Portal./
    );
    expect(tooltip1).toBeInTheDocument();

    const rds = screen.getByTestId('root_locations_regionalDistricts-value');
    expect(rds).toHaveTextContent('TBD');

    const helpIcon2 = rds.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon2).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(
      /Coverage data requires updating in the Portal./
    );
    expect(tooltip2).toBeInTheDocument();
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
    expect(screen.getAllByText('(Conditional Approval)')).toHaveLength(4);
  });

  it('should show the correct data when application is conditional approval but no funding has been set', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadConditionalApprovalNoFunding);
      pageTestingHelper.renderPage();
    });

    // date conditional approved
    expect(screen.getByText('2023-05-02')).toBeInTheDocument();
    // conditional approval
    expect(screen.getAllByText('(Conditional Approval)')).toHaveLength(1);
  });

  it('should show the correct data when application is conditional approval when only bc funding is set', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadConditionalApprovalBcFunding);
      pageTestingHelper.renderPage();
    });

    // bc funding requested and total requested from ccbc
    expect(screen.getAllByText('$1,234')).toHaveLength(2);
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
    // indigenous communities
    expect(
      screen.getByTestId('root_counts_indigenousCommunities-value')
    ).toHaveTextContent('1');
    // communities
    expect(
      screen.getByTestId('root_counts_communities-value')
    ).toHaveTextContent('4');
    // non-indigenous communities
    expect(
      screen.getByTestId('root_counts_nonIndigenousCommunities-value')
    ).toHaveTextContent('3');

    // milestone
    expect(screen.getByText('24%')).toBeInTheDocument();
    // application source
    expect(screen.getAllByText(/SOW amendment 1/)).toHaveLength(7);
    expect(screen.getAllByText('(SOW)')).toHaveLength(10);
  });

  it('should show the alert when SOW has not been uploaded and application is agreement signed', async () => {
    await act(async () => {
      pageTestingHelper.loadQuery(mockQueryPayloadAgreementSignedMissingSow);
      pageTestingHelper.renderPage();
    });

    expect(screen.queryAllByText('(SOW)')).toHaveLength(0);
    const alerts = screen.getAllByTestId('styled-alert');
    expect(alerts).toHaveLength(4);

    fireEvent.mouseOver(alerts[1]);
    expect(
      await screen.findByText(
        'Highlighted cells are null because SOW Excel table has not been uploaded in the portal'
      )
    ).toBeInTheDocument();

    // locations data
    const benefitingIndigenousCommunities = screen.getByTestId(
      'root_locations_benefitingIndigenousCommunities-value'
    );
    expect(benefitingIndigenousCommunities).toHaveTextContent('TBD');
    const helpIcon1 = benefitingIndigenousCommunities.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon1).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon1);
    const tooltip1 = await screen.findByText(
      /This value is informed by SOW tab 8, which has not been uploaded to the portal/
    );
    expect(tooltip1).toBeInTheDocument();

    const benefitingCommunities = screen.getByTestId(
      'root_locations_benefitingCommunities-value'
    );
    expect(benefitingCommunities).toHaveTextContent('TBD');

    const helpIcon2 = benefitingCommunities.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon2).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(
      /This value is informed by SOW tab 8, which has not been uploaded to the portal/
    );
    expect(tooltip2).toBeInTheDocument();
  });

  it('should show the map in two places', async () => {
    pageTestingHelper.setMockRouterValues({
      query: {
        applicationId: '1',
      },
      asPath: '/summary',
    });

    await act(async () => {
      pageTestingHelper.loadQuery();
      pageTestingHelper.renderPage();
    });

    await waitFor(() =>
      expect(screen.getByTestId('expand-map')).toBeInTheDocument()
    );

    const expandMapButton = screen.getByTestId('expand-map');

    await act(async () => {
      fireEvent.click(expandMapButton);
    });

    await waitFor(() =>
      expect(screen.getByTestId('collapse-map')).toBeInTheDocument()
    );
  });

  it('funding accordion should be editable', async () => {
    pageTestingHelper.loadQuery(mockQueryPayloadReceived);
    pageTestingHelper.renderPage();

    const fundingSection = document.getElementById('root_funding');
    expect(fundingSection).toBeInTheDocument();

    const icons = screen.getAllByRole('img', { hidden: true });

    const penIcon = icons.find((icon) => icon.classList.contains('fa-pen'));
    expect(penIcon).toBeInTheDocument();
    expect(fundingSection).toContainElement(penIcon as HTMLElement);
  });
});
