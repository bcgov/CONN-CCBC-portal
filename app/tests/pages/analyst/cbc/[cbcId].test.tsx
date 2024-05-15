import Cbc from 'pages/analyst/cbc/[cbcId]';
import { screen } from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import compiledCbcIdQuery, {
  CbcIdQuery,
} from '../../../../__generated__/CbcIdQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';

const mockShowCbcEdit: moduleApi.FeatureResult<boolean> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_cbc_edit',
};

const mockQueryPayload = {
  Query() {
    return {
      cbcByRowId: {
        projectNumber: 5555,
        rowId: 1,
        sharepointTimestamp: '2024-10-01T00:00:00.000Z',
        cbcDataByCbcId: {
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
                sharepointTimestamp: '2024-10-01T00:00:00.000Z',
                rowId: 1,
                projectNumber: 5555,
                updatedAt: '2024-10-01T00:00:00.000Z',
                updatedBy: 'test',
              },
            },
          ],
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<CbcIdQuery>({
  pageComponent: Cbc,
  compiledQuery: compiledCbcIdQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('Cbc', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { cbcId: '1' },
    });
  });
  it('should have the correct accordions', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Tombstone')).toBeInTheDocument();
    expect(screen.getByText('Project type')).toBeInTheDocument();
    expect(screen.getByText('Locations and counts')).toBeInTheDocument();
    expect(screen.getByText('Funding')).toBeInTheDocument();
    expect(screen.getByText('Events and dates')).toBeInTheDocument();
    expect(screen.getByText('Miscellaneous')).toBeInTheDocument();
    expect(screen.getByText('Project data reviews')).toBeInTheDocument();
  });
  it('should have the correct header data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    // left side of header
    expect(screen.getByRole('heading', { name: '5555' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Internet company 1' })
    ).toBeInTheDocument();
    // right side (editable) of header
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toHaveValue('complete');
    expect(screen.getByLabelText('Phase')).toBeInTheDocument();
    expect(screen.getByLabelText('Phase')).toHaveValue('2');
    expect(screen.getByLabelText('Intake')).toBeInTheDocument();
    expect(screen.getByLabelText('Intake')).toHaveValue('1');
  });
  it('should have the correct actions when edit enabled', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Expand all')).toBeInTheDocument();
    expect(screen.getByText('Collapse all')).toBeInTheDocument();
    expect(screen.getByText('Quick edit')).toBeInTheDocument();
  });
});
