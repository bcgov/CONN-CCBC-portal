import cbcSection from 'pages/analyst/cbc/[cbcId]/edit/[section]';
import { act, fireEvent, screen } from '@testing-library/react';
import compiledSectionQuery, {
  SectionCbcDataQuery,
} from '../../../../../__generated__/SectionCbcDataQuery.graphql';
import PageTestingHelper from '../../../../utils/pageTestingHelper';

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
                rowId: 20,
                projectNumber: 123456678,
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
                  originalProjectNumber: 5555,
                  projectStatus: 'Reporting Complete',
                  federalFundingRequested: 555555,
                  householdCount: null,
                  applicantAmount: 555555,
                  bcFundingRequested: 5555555,
                  projectLocations: 'Location 1',
                  milestoneComments: 'Requested extension to March 31, 2024',
                  proposedStartDate: '2020-07-01T00:00:00.000Z',
                  primaryNewsRelease:
                    'https://www.somethingmadeup.ca/en/innovation-science-economic-development/internet.html',
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
                },
              },
            },
          ],
        },
        cbcProjectCommunitiesByCbcId: {
          nodes: [
            {
              communitiesSourceDataByCommunitiesSourceDataId: {
                economicRegion: 'Economic Region',
                geographicNameId: 1,
                geographicType: 'Geographic Type',
                regionalDistrict: 'Regional District',
                bcGeographicName: 'BC Geographic Name',
              },
            },
          ],
        },
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<SectionCbcDataQuery>({
  pageComponent: cbcSection,
  compiledQuery: compiledSectionQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('EditCbcSection', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { cbcId: '1', section: 'tombstone' },
    });
  });

  it('should render the form with correct data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByTestId('root_projectDescription')).toHaveValue(
      'Description 1'
    );
  });

  it('should handle form submission', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByRole('button', { name: /save/i });

    act(() => {
      fireEvent.click(saveButton);
    });

    // Add assertions to check if the modal opened and data was set correctly
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should navigate to the CBC page on cancel', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    act(() => {
      fireEvent.click(cancelButton);
    });

    // Check if the router pushed to the correct URL
    expect(pageTestingHelper.router.push).toHaveBeenCalledWith(
      '/analyst/cbc/1'
    );
  });

  it('should open the change reason modal on form submission', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByRole('button', { name: /save/i });

    act(() => {
      fireEvent.click(saveButton);
    });

    // Check if the modal opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('reason-for-change')).toBeInTheDocument();
  });

  it('should update state correctly when change reason is entered', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByRole('button', { name: /save/i });

    act(() => {
      fireEvent.click(saveButton);
    });

    const changeReasonInput = screen.getByTestId('reason-for-change');
    act(() => {
      fireEvent.change(changeReasonInput, {
        target: { value: 'Updated reason' },
      });
    });

    expect(changeReasonInput).toHaveValue('Updated reason');
  });

  it('should call update function with correct data on save', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByRole('button', { name: /save/i });

    act(() => {
      fireEvent.click(saveButton);
    });

    const changeReasonInput = screen.getByTestId('reason-for-change');
    act(() => {
      fireEvent.change(changeReasonInput, {
        target: { value: 'Updated reason' },
      });
    });

    const saveModalButton = screen.getByRole('button', { name: /save/i });
    act(() => {
      fireEvent.click(saveModalButton);
    });

    pageTestingHelper.expectMutationToBeCalled(
      'updateCbcDataAndInsertChangeReasonMutation',
      {
        inputCbcData: {
          rowId: 20,
          cbcDataPatch: {
            jsonData: {
              projectNumber: 5555,
              originalProjectNumber: 5555,
              phase: 2,
              intake: 1,
              projectStatus: 'Reporting Complete',
              changeRequestPending: 'No',
              projectTitle: 'Project 1',
              projectDescription: 'Description 1',
              currentOperatingName: 'Internet company 1',
              federalFundingSource: 'ISED-CTI',
              projectType: 'Transport',
              transportProjectType: 'Fibre',
              projectLocations: 'Location 1',
              indigenousCommunities: 5,
              householdCount: null,
              transportKm: 124,
              highwayKm: null,
              bcFundingRequested: 5555555,
              federalFundingRequested: 555555,
              applicantAmount: 555555,
              otherFundingRequested: 265000,
              totalProjectBudget: 5555555,
              announcedByProvince: 'YES',
              dateAgreementSigned: '2021-02-24T00:00:00.000Z',
              proposedStartDate: '2020-07-01T00:00:00.000Z',
              proposedCompletionDate: '2023-03-31T00:00:00.000Z',
              dateAnnounced: '2019-07-02T00:00:00.000Z',
              milestoneComments: 'Requested extension to March 31, 2024',
              primaryNewsRelease:
                'https://www.somethingmadeup.ca/en/innovation-science-economic-development/internet.html',
              lastReviewed: '2023-07-11T00:00:00.000Z',
              reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
            },
          },
        },
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: 'Updated reason',
            cbcDataId: 20,
          },
        },
      }
    );
  });
});
