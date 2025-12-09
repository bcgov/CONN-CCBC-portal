import { cbcDataQueryResult, ccbcDataQueryResult } from '../reporting/testData';

export const testApplicationData = {
  data: {
    applicationByRowId: {
      announcements: {
        totalCount: 0,
      },
      applicationAnnouncedsByApplicationId: {
        nodes: [],
      },
      applicationDependenciesByApplicationId: {
        nodes: [
          {
            jsonData: {
              crtcProjectDependent: 'Yes',
              connectedCoastNetworkDependent: 'TBD',
            },
          },
        ],
      },
      applicationStatusesByApplicationId: {
        nodes: [
          {
            createdAt: '2022-01-01T19:47:17.20671+00:00',
            status: 'submitted',
          },
        ],
      },
      allAssessments: {
        nodes: [
          {
            assessmentDataType: 'technical',
            jsonData: {
              decision: 'Pass',
              nextStep: 'Assessment complete',
              assignedTo: 'Test',
              otherFiles: [],
              targetDate: '2023-12-31',
            },
          },
        ],
      },
      formData: {
        ...ccbcDataQueryResult.data.allApplications.edges[0].node.formData,
      },
      projectInformationDataByApplicationId: {
        nodes: [
          {
            jsonData: {
              hasFundingAgreementBeenSigned: false,
            },
          },
        ],
      },
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
                  geoNameId: 26059,
                  households: 9,
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
                  geoNameId: 65365,
                  households: 52,
                  projectZone: 6,
                  isIndigenous: 'Y',
                  economicRegion: 'Vancouver Island and Coast',
                  proposedSolution: 'Fibre-Optic',
                  regionalDistrict: 'Regional District of Mount Waddington',
                  pointOfPresenceId: 'Connected Coast Health Bay',
                },
              ],
              communitiesToBeServed: 2,
              totalNumberOfHouseholds: 61,
              indigenousCommunitiesToBeServed: 1,
              totalNumberOfIndigenousHouseholds: 52,
            },
            source: {
              uuid: '5555555-f5ea-44fb-9963-d88f17863c23',
              source: 'rfi',
              rfiNumber: 'CCBC-010001-1',
            },
          },
        ],
      },
      conditionalApproval: {
        jsonData: {
          decision: {
            ministerDate: '2023-10-10',
            ministerDecision: 'Approved',
            provincialRequested: 55555,
            ministerAnnouncement: 'Hold announcement',
          },
          response: {
            applicantResponse: 'Accepted',
            statusApplicantSees: 'Conditionally Approved',
          },
          isedDecisionObj: {
            isedDate: '2023-10-10',
            isedDecision: 'Approved',
            federalRequested: 55555,
            isedAnnouncement: 'Hold announcement',
          },
          letterOfApproval: {
            letterOfApprovalUpload: [],
            letterOfApprovalDateSent: '2024-10-11',
          },
        },
      },
      changeRequestDataByApplicationId: {
        edges: [],
      },
      applicationPendingChangeRequestsByApplicationId: {
        nodes: [
          {
            isPending: true,
          },
        ],
        totalCount: 1,
      },
      status: 'applicant_conditionally_approved',
      intakeNumber: 1,
      ccbcNumber: 'CCBC-010001',
      zones: 6,
      projectName: 'A testy test test',
      program: 'CCBC',
      package: 2,
      organizationName: 'A testing org',
      externalStatus: 'applicant_conditionally_approved',
      announced: null,
      internalDescription: '',
      applicationProjectTypesByApplicationId: {
        nodes: [
          {
            projectType: 'lastMile',
          },
        ],
      },
    },
    allApplicationSowData: {
      nodes: [
        {
          jsonData: {
            lastMileFibre: true,
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
      ],
    },
    allApplicationErs: {
      edges: [
        {
          node: {
            applicationId: 56,
            ccbcNumber: 'CCBC-010001',
            er: 'Vancouver Island and Coast',
          },
        },
      ],
    },
    allApplicationRds: {
      edges: [
        {
          node: {
            applicationId: 56,
            ccbcNumber: 'CCBC-010001',
            rd: 'Regional District of Mount Waddington',
          },
        },
      ],
    },
  },
};

export const testCbcData = {
  data: {
    cbcByRowId: {
      projectNumber: 5070,
      rowId: 1,
      sharepointTimestamp: '2024-05-24T00:00:00+00:00',
      cbcDataByCbcId: {
        edges: [{ ...cbcDataQueryResult.data.allCbcData.edges[0] }],
      },
      cbcProjectCommunitiesByCbcId: {
        nodes: [
          {
            communitiesSourceDataByCommunitiesSourceDataId: {
              economicRegion: 'Cariboo',
              geographicNameId: 65136,
              geographicType: 'Indian Reserve-Réserve indienne',
              regionalDistrict: 'Cariboo Regional District',
              bcGeographicName: 'Williams Lake 1',
              rowId: 3116,
            },
          },
        ],
      },
    },
  },
};
