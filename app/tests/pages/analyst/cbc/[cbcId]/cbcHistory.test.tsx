import CbcHistory from 'pages/analyst/cbc/[cbcId]/cbcHistory';
import { screen } from '@testing-library/react';
import compiledCbcHistoryQuery, {
  cbcHistoryQuery,
} from '../../../../../__generated__/cbcHistoryQuery.graphql';
import PageTestingHelper from '../../../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      cbcByRowId: {
        projectNumber: 1234,
        rowId: 1,
        sharepointTimestamp: '2024-05-24T13:22:54-04:00',
        history: {
          nodes: [
            {
              record: {
                id: 8,
                cbc_id: 5,
                json_data: {
                  notes: 'asdf',
                  phase: '1',
                  intake: '3',
                  locked: null,
                  highwayKm: null,
                  projectType: 'Cellular',
                  reviewNotes: 'These are review notes',
                  transportKm: 321,
                  lastReviewed: '2024-07-09T00:00:00.000Z',
                  projectTitle: 'This is a project title',
                  dateAnnounced: '2030-07-02T00:00:00.000Z',
                  projectNumber: 1234,
                  projectStatus: 'Agreement Signed',
                  householdCount: null,
                  agreementSigned: true,
                  applicantAmount: 15000,
                  projectLocations: 'These are project locations',
                  milestoneComments: 'Milestone comments',
                  proposedStartDate: '2020-07-01T00:00:00.000Z',
                  bcFundingRequested: 1145480,
                  highwayProjectType: 'Cellular',
                  primaryNewsRelease: 'https://www.canada.ca/news-release',
                  projectDescription: 'Project Description',
                  totalProjectBudget: 10000,
                  announcedByProvince: false,
                  dateAgreementSigned: '2027-02-01T00:00:00.000Z',
                  changeRequestPending: false,
                  currentOperatingName: 'Cbc Project Supplier Name',
                  federalFundingSource: 'ISED-CTI',
                  federalProjectNumber: 'CTI-987654',
                  transportProjectType: 'Fibre',
                  indigenousCommunities: 4,
                  otherFundingRequested: 123456,
                  proposedCompletionDate: '2029-03-31T00:00:00.000Z',
                  constructionCompletedOn: null,
                  dateApplicationReceived: '2020-05-25T00:00:00.000Z',
                  federalFundingRequested: 321654,
                  reportingCompletionDate: null,
                  applicantContractualName: 'Cbc Project Supplier Name',
                  dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                  eightThirtyMillionFunding: false,
                  projectMilestoneCompleted: 33,
                  communitiesAndLocalesCount: 8,
                  conditionalApprovalLetterSent: true,
                  connectedCoastNetworkDependant: false,
                },
                created_at: '2024-05-24T13:39:54.330442-04:00',
                created_by: null,
                updated_at: '2024-09-06T10:30:31.905653-04:00',
                updated_by: 100,
                archived_at: null,
                archived_by: null,
                change_reason: 'These are change reasons',
                project_number: 1234,
                sharepoint_timestamp: '2024-05-24T13:22:54-04:00',
                added_communities: [
                  {
                    id: 48,
                    cbc_id: 12,
                    latitude: 54.066427,
                    map_link:
                      'https://apps.gov.bc.ca/pub/bcgnws/names/64787.html',
                    longitude: -129.184972,
                    created_at: '2024-08-07T16:57:20.890025+00:00',
                    created_by: 336,
                    updated_at: '2024-09-25T18:18:06.164211+00:00',
                    updated_by: 100,
                    archived_at: null,
                    archived_by: null,
                    economic_region: 'North Coast',
                    geographic_type: 'Indian Reserve-Réserve indienne',
                    regional_district: 'Regional District of Kitimat-Stikine',
                    bc_geographic_name: 'Alastair 82',
                    geographic_name_id: 64787,
                    communities_source_data_id: 64787,
                  },
                ],
                deleted_communities: [
                  {
                    id: 263,
                    cbc_id: 12,
                    latitude: 52.383108,
                    map_link:
                      'https://apps.gov.bc.ca/pub/bcgnws/names/3350.html',
                    longitude: -126.75150000000001,
                    created_at: '2024-08-07T16:57:22.385446+00:00',
                    created_by: 336,
                    updated_at: '2024-09-25T18:18:07.940174+00:00',
                    updated_by: 100,
                    archived_at: null,
                    archived_by: null,
                    economic_region: 'Vancouver Island and Coast',
                    geographic_type: 'Community',
                    regional_district: 'Central Coast Regional District',
                    bc_geographic_name: 'Bella Coola',
                    geographic_name_id: 3350,
                    communities_source_data_id: 3350,
                  },
                  {
                    id: 431,
                    cbc_id: 12,
                    latitude: 50.023056,
                    map_link:
                      'https://apps.gov.bc.ca/pub/bcgnws/names/34755.html',
                    longitude: -125.243611,
                    created_at: '2024-08-07T16:57:23.578343+00:00',
                    created_by: 336,
                    updated_at: '2024-09-25T18:18:09.156305+00:00',
                    updated_by: 100,
                    archived_at: null,
                    archived_by: null,
                    economic_region: 'Vancouver Island and Coast',
                    geographic_type: 'City',
                    regional_district: 'Strathcona Regional District',
                    bc_geographic_name: 'Campbell River',
                    geographic_name_id: 34755,
                    communities_source_data_id: 34755,
                  },
                ],
              },
              oldRecord: {
                id: 8,
                cbc_id: 5,
                json_data: {
                  notes: null,
                  phase: '2',
                  intake: '1',
                  locked: null,
                  highwayKm: null,
                  projectType: 'Transport',
                  reviewNotes: 'These are review notes',
                  transportKm: 321,
                  lastReviewed: '2024-07-09T00:00:00.000Z',
                  projectTitle: 'This is a project title',
                  dateAnnounced: '2030-07-02T00:00:00.000Z',
                  projectNumber: 1234,
                  projectStatus: 'Agreement Signed',
                  householdCount: null,
                  agreementSigned: true,
                  applicantAmount: 15000,
                  projectLocations: 'These are project locations',
                  milestoneComments: 'Milestone comments',
                  proposedStartDate: '2020-07-01T00:00:00.000Z',
                  bcFundingRequested: 1145480,
                  highwayProjectType: null,
                  primaryNewsRelease: 'https://www.canada.ca/news-release',
                  projectDescription: 'Project Description',
                  totalProjectBudget: 10000,
                  announcedByProvince: true,
                  dateAgreementSigned: '2027-02-01T00:00:00.000Z',
                  changeRequestPending: false,
                  currentOperatingName: 'Cbc Project Supplier Name',
                  federalFundingSource: 'ISED-CTI',
                  federalProjectNumber: 'CTI-987654',
                  transportProjectType: 'Fibre',
                  indigenousCommunities: 4,
                  otherFundingRequested: 123456,
                  proposedCompletionDate: '2029-03-31T00:00:00.000Z',
                  constructionCompletedOn: null,
                  dateApplicationReceived: '2020-05-25T00:00:00.000Z',
                  federalFundingRequested: 321654,
                  reportingCompletionDate: null,
                  applicantContractualName: 'Cbc Project Supplier Name',
                  dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                  eightThirtyMillionFunding: false,
                  projectMilestoneCompleted: 33,
                  communitiesAndLocalesCount: 8,
                  conditionalApprovalLetterSent: true,
                  connectedCoastNetworkDependant: false,
                },
                created_at: '2024-05-24T13:39:54.330442-04:00',
                created_by: null,
                updated_at: '2024-08-27T19:27:08.26417-04:00',
                updated_by: 185,
                archived_at: null,
                archived_by: null,
                change_reason: null,
                project_number: 1234,
                sharepoint_timestamp: '2024-05-24T13:22:54-04:00',
              },
              op: 'UPDATE',
              tableName: 'cbc_data',
              ccbcUserByCreatedBy: {
                givenName: 'Tony',
                familyName: 'User',
              },
            },
          ],
        },
      },
      cbcDataByCbcId: {
        edges: {
          node: {
            jsonData: {
              originalProjectNumber: 6713,
            }
          }
        }
      },
      session: {
        sub: 'asdf@idir',
      },
    };
  },
};

const mockOriginalProjectQueryPayload = {
  Query() {
    return {
      allCbcs: {
        nodes: [{
          history: {
            nodes: [
              {
                record: {
                  id: 8,
                  cbc_id: 5,
                  json_data: {
                    notes: 'asdf',
                    phase: '1',
                    intake: '3',
                    locked: null,
                    highwayKm: null,
                    projectType: 'Cellular',
                    reviewNotes: 'These are review notes',
                    transportKm: 321,
                    lastReviewed: '2024-07-09T00:00:00.000Z',
                    projectTitle: 'Project1234',
                    dateAnnounced: '2030-07-02T00:00:00.000Z',
                    projectNumber: 1234,
                    projectStatus: 'Agreement Signed',
                    householdCount: null,
                    agreementSigned: true,
                    applicantAmount: 15000,
                    projectLocations: 'These are project locations',
                    milestoneComments: 'Milestone comments',
                    proposedStartDate: '2020-07-01T00:00:00.000Z',
                    bcFundingRequested: 1145480,
                    highwayProjectType: 'Cellular',
                    primaryNewsRelease: 'https://www.canada.ca/news-release',
                    projectDescription: 'Project Description',
                    totalProjectBudget: 10000,
                    announcedByProvince: false,
                    dateAgreementSigned: '2027-02-01T00:00:00.000Z',
                    changeRequestPending: false,
                    currentOperatingName: 'Cbc Project Supplier Name',
                    federalFundingSource: 'ISED-CTI',
                    federalProjectNumber: 'CTI-987654',
                    transportProjectType: 'Fibre',
                    indigenousCommunities: 4,
                    otherFundingRequested: 123456,
                    proposedCompletionDate: '2029-03-31T00:00:00.000Z',
                    constructionCompletedOn: null,
                    dateApplicationReceived: '2020-05-25T00:00:00.000Z',
                    federalFundingRequested: 321654,
                    reportingCompletionDate: null,
                    applicantContractualName: 'Cbc Project Supplier Name',
                    dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                    eightThirtyMillionFunding: false,
                    projectMilestoneCompleted: 33,
                    communitiesAndLocalesCount: 8,
                    conditionalApprovalLetterSent: true,
                    connectedCoastNetworkDependant: false,
                  },
                  created_at: '2024-05-24T13:39:54.330442-04:00',
                  created_by: null,
                  updated_at: '2024-09-06T10:30:31.905653-04:00',
                  updated_by: 100,
                  archived_at: null,
                  archived_by: null,
                  change_reason: 'These are change reasons',
                  project_number: 1234,
                  sharepoint_timestamp: '2024-04-24T13:22:54-04:00',
                  added_communities: [
                    {
                      id: 48,
                      cbc_id: 12,
                      latitude: 54.066427,
                      map_link:
                        'https://apps.gov.bc.ca/pub/bcgnws/names/64787.html',
                      longitude: -129.184972,
                      created_at: '2024-08-07T16:57:20.890025+00:00',
                      created_by: 336,
                      updated_at: '2024-09-25T18:18:06.164211+00:00',
                      updated_by: 100,
                      archived_at: null,
                      archived_by: null,
                      economic_region: 'North Coast',
                      geographic_type: 'Indian Reserve-Réserve indienne',
                      regional_district: 'Regional District of Kitimat-Stikine',
                      bc_geographic_name: 'Alastair 82',
                      geographic_name_id: 64787,
                      communities_source_data_id: 64787,
                    },
                  ],
                  deleted_communities: [
                    {
                      id: 263,
                      cbc_id: 12,
                      latitude: 52.383108,
                      map_link:
                        'https://apps.gov.bc.ca/pub/bcgnws/names/3350.html',
                      longitude: -126.75150000000001,
                      created_at: '2024-08-07T16:57:22.385446+00:00',
                      created_by: 336,
                      updated_at: '2024-09-25T18:18:07.940174+00:00',
                      updated_by: 100,
                      archived_at: null,
                      archived_by: null,
                      economic_region: 'Vancouver Island and Coast',
                      geographic_type: 'Community',
                      regional_district: 'Central Coast Regional District',
                      bc_geographic_name: 'Bella Coola',
                      geographic_name_id: 3350,
                      communities_source_data_id: 3350,
                    },
                    {
                      id: 431,
                      cbc_id: 12,
                      latitude: 50.023056,
                      map_link:
                        'https://apps.gov.bc.ca/pub/bcgnws/names/34755.html',
                      longitude: -125.243611,
                      created_at: '2024-08-07T16:57:23.578343+00:00',
                      created_by: 336,
                      updated_at: '2024-09-25T18:18:09.156305+00:00',
                      updated_by: 100,
                      archived_at: null,
                      archived_by: null,
                      economic_region: 'Vancouver Island and Coast',
                      geographic_type: 'City',
                      regional_district: 'Strathcona Regional District',
                      bc_geographic_name: 'Campbell River',
                      geographic_name_id: 34755,
                      communities_source_data_id: 34755,
                    },
                  ],
                },
                oldRecord: {
                  id: 8,
                  cbc_id: 5,
                  json_data: {
                    notes: null,
                    phase: '2',
                    intake: '1',
                    locked: null,
                    highwayKm: null,
                    projectType: 'Transport',
                    reviewNotes: 'These are review notes',
                    transportKm: 321,
                    lastReviewed: '2024-07-09T00:00:00.000Z',
                    projectTitle: 'This is a project title',
                    dateAnnounced: '2030-07-02T00:00:00.000Z',
                    projectNumber: 1234,
                    projectStatus: 'Agreement Signed',
                    householdCount: null,
                    agreementSigned: true,
                    applicantAmount: 15000,
                    projectLocations: 'These are project locations',
                    milestoneComments: 'Milestone comments',
                    proposedStartDate: '2020-07-01T00:00:00.000Z',
                    bcFundingRequested: 1145480,
                    highwayProjectType: null,
                    primaryNewsRelease: 'https://www.canada.ca/news-release',
                    projectDescription: 'Project Description',
                    totalProjectBudget: 10000,
                    announcedByProvince: true,
                    dateAgreementSigned: '2027-02-01T00:00:00.000Z',
                    changeRequestPending: false,
                    currentOperatingName: 'Cbc Project Supplier Name',
                    federalFundingSource: 'ISED-CTI',
                    federalProjectNumber: 'CTI-987654',
                    transportProjectType: 'Fibre',
                    indigenousCommunities: 4,
                    otherFundingRequested: 123456,
                    proposedCompletionDate: '2029-03-31T00:00:00.000Z',
                    constructionCompletedOn: null,
                    dateApplicationReceived: '2020-05-25T00:00:00.000Z',
                    federalFundingRequested: 321654,
                    reportingCompletionDate: null,
                    applicantContractualName: 'Cbc Project Supplier Name',
                    dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
                    eightThirtyMillionFunding: false,
                    projectMilestoneCompleted: 33,
                    communitiesAndLocalesCount: 8,
                    conditionalApprovalLetterSent: true,
                    connectedCoastNetworkDependant: false,
                  },
                  created_at: '2024-05-24T13:39:54.330442-04:00',
                  created_by: null,
                  updated_at: '2024-08-27T19:27:08.26417-04:00',
                  updated_by: 185,
                  archived_at: null,
                  archived_by: null,
                  change_reason: null,
                  project_number: 1234,
                  sharepoint_timestamp: '2024-04-24T13:22:54-04:00',
                },
                op: 'UPDATE',
                tableName: 'cbc_data',
                ccbcUserByCreatedBy: {
                  givenName: 'Tony',
                  familyName: 'User',
                },
              },
            ]
          }
        }]
      }
    }
  },
};

const pageTestingHelper = new PageTestingHelper<cbcHistoryQuery>({
  pageComponent: CbcHistory,
  compiledQuery: compiledCbcHistoryQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('Cbc History', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { cbcId: '1' },
    });
  });
  it('should have the show history', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const historyNameAndDate = screen.getByTestId(
      'cbc-data-updater-and-timestamp'
    );

    expect(historyNameAndDate).toHaveTextContent(
      /Tony User updated the CBC data on Sep 6, 2024, 7:30 a\.m\./
    );

    const historyDetails = screen.getAllByTestId('diff-table');
    expect(historyDetails).toHaveLength(1);
  });
  it('should have the added and removed communities', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const addedCommunities = screen.getByText(/Added community location data/);
    expect(addedCommunities).toBeInTheDocument();

    const removedCommunities = screen.getByText(
      /Deleted community location data/
    );
    expect(removedCommunities).toBeInTheDocument();

    const addedCommunityRows = document.querySelectorAll(
      'tr[data-key^="Added-row"]'
    );
    expect(addedCommunityRows).toHaveLength(1);

    const removedCommunityRows = document.querySelectorAll(
      'tr[data-key^="Deleted-row"]'
    );
    expect(removedCommunityRows).toHaveLength(2);
  });
});

describe('Cbc Original Project History', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { cbcId: '1' },
    });
  });

  it('should have history from original project number', async () => {
    pageTestingHelper.loadQuery();

    pageTestingHelper.environment.mock.queueOperationResolver((operation) => {
      if (operation.request.node.operation.name === 'CbcHistoryTableOriginalProjectQuery') {
        return mockOriginalProjectQueryPayload;
      }
      return null;
    });

    pageTestingHelper.renderPage();

    const historyNameAndDate = screen.getByTestId(
      'cbc-data-updater-and-timestamp'
    );

    expect(historyNameAndDate).toHaveTextContent(/Tony User updated the CBC data/);
    // expect(screen.getByText(/Original project notes from 6713/)).toBeInTheDocument();
  });
});