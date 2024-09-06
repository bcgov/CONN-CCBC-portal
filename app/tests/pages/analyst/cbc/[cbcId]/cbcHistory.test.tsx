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
      session: {
        sub: 'asdf@idir',
      },
    };
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
    console.log(screen);
    const historyNameAndDate = screen.getByTestId(
      'cbc-data-updater-and-timestamp'
    );

    expect(historyNameAndDate).toHaveTextContent(
      /Tony User updated the CBC data on Sep 6, 2024, 7:30 a\.m\.Reason for change: These are change reasons/
    );

    const historyDetails = screen.getAllByTestId('diff-table');
    expect(historyDetails).toHaveLength(1);
  });
});
