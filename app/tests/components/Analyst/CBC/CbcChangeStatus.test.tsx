import { graphql } from 'react-relay';
import compiledQuery, {
  CbcChangeStatusTestQuery,
} from '__generated__/CbcChangeStatusTestQuery.graphql';
import { act, screen, fireEvent } from '@testing-library/react';
import CbcChangeStatus from 'components/Analyst/CBC/CbcChangeStatus';
import ComponentTestingHelper from '../../../utils/componentTestingHelper';

const testQuery = graphql`
  query CbcChangeStatusTestQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
        edges {
          node {
            jsonData
            sharepointTimestamp
            rowId
            projectNumber
            updatedAt
            updatedBy
          }
        }
      }
      ...CbcChangeStatus_query
    }
  }
`;

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
                  otherFundingRequested: 265000,
                  projectTitle: 'Project 1',
                  dateAnnounced: '2019-07-02T00:00:00.000Z',
                  projectNumber: 5555,
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
                otherFundingRequested: 265000,
                projectTitle: 'Project 1',
                dateAnnounced: '2019-07-02T00:00:00.000Z',
                projectNumber: 5555,
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
              sharepointTimestamp: '2024-10-01T00:00:00.000Z',
              rowId: 1,
              projectNumber: 5555,
              updatedAt: '2024-10-01T00:00:00.000Z',
              updatedBy: 'test',
            },
          },
        ],
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<CbcChangeStatusTestQuery>({
    component: CbcChangeStatus as any,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      cbcData: data,
      status:
        data.cbcByRowId.cbcDataByCbcId.edges[0].node.jsonData.projectStatus,
      statusList: [
        {
          description: 'Conditionally Approved',
          name: 'conditionally_approved',
          id: 1,
        },
        { description: 'Reporting Complete', name: 'complete', id: 2 },
        { description: 'Agreement Signed', name: 'approved', id: 3 },
        { description: 'Withdrawn', name: 'withdrawn', id: 4 },
      ],
    }),
  });

describe('The application header component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
    // externalComponentTestingHelper.reinit();
  });

  it('displays the current cbc project status', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Reporting Complete')).toBeVisible();
    expect(screen.getByTestId('change-status')).toHaveValue('complete');
  });

  it('has the correct style for the current status', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    expect(select).toHaveStyle(`color: #003366;`);
  });

  it('has the list of statuses', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('Agreement Signed')).toBeInTheDocument();
    expect(screen.getByText('Reporting Complete')).toBeInTheDocument();
    expect(screen.getByText('Conditionally Approved')).toBeInTheDocument();
  });

  it('Changes status depending on which status is selected', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'approved' } });
    });
    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          cbcDataByCbcId: {
            jsonData: {
              projectStatus: 'Agreement Signed',
            },
          },
        },
      });
    });
    expect(screen.getByTestId('change-status')).toHaveValue('approved');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'conditionally_approved' } });
    });
    await act(async () => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          cbcDataByCbcId: {
            jsonData: {
              projectStatus: 'Conditionally Approved',
            },
          },
        },
      });
    });
    expect(screen.getByTestId('change-status')).toHaveValue(
      'conditionally_approved'
    );
  });

  it('displays the confirmation modal and calls the mutation on save', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'approved' } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateCbcDataByRowIdMutation',
      {
        input: {
          cbcDataPatch: {
            jsonData: {
              projectStatus: 'Agreement Signed',
            },
          },
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          cbcDataByCbcId: {
            jsonData: {
              projectStatus: 'Agreement Signed',
            },
          },
        },
      });
    });

    expect(screen.getByText('Agreement Signed')).toBeVisible();
    expect(screen.getByTestId('change-status')).toHaveValue('approved');
  });

  it('correctly converts withdrawn status', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const select = screen.getByTestId('change-status');

    await act(async () => {
      fireEvent.change(select, { target: { value: 'withdrawn' } });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateCbcDataByRowIdMutation',
      {
        input: {
          cbcDataPatch: {
            jsonData: {
              projectStatus: 'Withdrawn',
            },
          },
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          cbcDataByCbcId: {
            jsonData: {
              projectStatus: 'Withdrawn',
            },
          },
        },
      });
    });

    expect(screen.getByTestId('change-status')).toHaveValue('withdrawn');
  });
});
