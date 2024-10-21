import cbcSection from 'pages/analyst/cbc/[cbcId]/edit/[section]';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
                  applicantContractualName: 'Test project contractual name',
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
                  projectMilestoneCompleted: 0.75,
                },
              },
            },
          ],
        },
        cbcProjectCommunitiesByCbcId: {
          nodes: [
            {
              communitiesSourceDataByCommunitiesSourceDataId: {
                economicRegion: 'Economic Region 1',
                geographicNameId: 10,
                geographicType: 'Geographic Type',
                regionalDistrict: 'Regional District 1',
                bcGeographicName: 'BC Geographic Name 10',
                rowId: 1,
              },
            },
          ],
        },
      },
      allCommunitiesSourceData: {
        nodes: [
          {
            geographicNameId: 10,
            bcGeographicName: 'BC Geographic Name 10',
            economicRegion: 'Economic Region 1',
            regionalDistrict: 'Regional District 1',
          },
          {
            geographicNameId: 11,
            bcGeographicName: 'BC Geographic Name 11',
            economicRegion: 'Economic Region 1',
            regionalDistrict: 'Regional District 2',
          },
          {
            geographicNameId: 12,
            bcGeographicName: 'BC Geographic Name 12',
            economicRegion: 'Economic Region 2',
            regionalDistrict: 'Regional District 3',
          },
        ],
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

    expect(screen.getByTestId('root_applicantContractualName')).toHaveValue(
      'Test project contractual name'
    );
  });

  it('should handle form submission', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const saveButton = screen.getByRole('button', { name: /save/i });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Add assertions to check if the modal opened and data was set correctly
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should navigate to the CBC page on cancel', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await act(async () => {
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

    await act(async () => {
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

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const changeReasonInput = screen.getByTestId('reason-for-change');
    await act(async () => {
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

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const changeReasonInput = screen.getByTestId('reason-for-change');
    await act(async () => {
      fireEvent.change(changeReasonInput, {
        target: { value: 'Updated reason' },
      });
    });

    const saveModalButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
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
              applicantContractualName: 'Test project contractual name',
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
              projectMilestoneCompleted: 0.75,
            },
            changeReason: 'Updated reason',
          },
        },
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: 'Updated reason',
            cbcDataId: 20,
          },
        },
        inputCbcProjectCommunities: {
          _projectId: 1,
          _communityIdsToAdd: expect.anything(),
          _communityIdsToArchive: expect.anything(),
        },
      }
    );
  });

  it('should have the correct validation errors for tombstone projectStatus', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const projectStatusElement = screen.getByTestId(
      'root_federalProjectNumber'
    );
    const { parentElement } =
      projectStatusElement.parentElement.parentElement.parentElement;

    expect(parentElement).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = parentElement.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing Federal project number/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for accordion', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const projectStatusElement = screen.getByTestId(
      'root_federalProjectNumber'
    );
    const { parentElement } =
      projectStatusElement.parentElement.parentElement.parentElement;

    expect(parentElement).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = parentElement.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing Federal project number/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should call update function and cbcCommunityUpdate with correct data on save', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { cbcId: '1', section: 'locations' },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const economicRegion = screen.getAllByTestId(
      'economic-region-autocomplete'
    )[0];
    await act(async () => {
      await userEvent.type(economicRegion, '{ArrowDown}{Enter}', {
        skipClick: false,
        skipHover: false,
      });
    });
    const regionalDistrict = screen.getAllByTestId(
      'regional-district-autocomplete'
    )[0];
    await act(async () => {
      await userEvent.type(regionalDistrict, '{ArrowDown}{Enter}', {
        skipClick: false,
        skipHover: false,
      });
    });
    const geographicName = screen.getAllByTestId(
      'geographic-name-autocomplete'
    )[0];

    await act(async () => {
      await userEvent.type(geographicName, '{ArrowDown}{Enter}', {
        skipClick: false,
        skipHover: false,
      });
    });

    const addButton = screen.getByTestId('add-community-button');
    await act(async () => {
      await userEvent.click(addButton);
    });

    const clearButton = screen.getByTestId('clear-community-button');
    await act(async () => {
      await userEvent.click(clearButton);
    });

    const saveButton = screen.getByRole('button', { name: /save/i });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    const changeReasonInput = screen.getByTestId('reason-for-change');
    await act(async () => {
      fireEvent.change(changeReasonInput, {
        target: { value: 'Updated reason' },
      });
    });

    const saveModalButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
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
              applicantContractualName: 'Test project contractual name',
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
              projectMilestoneCompleted: 0.75,
              milestoneComments: 'Requested extension to March 31, 2024',
              primaryNewsRelease:
                'https://www.somethingmadeup.ca/en/innovation-science-economic-development/internet.html',
              lastReviewed: '2023-07-11T00:00:00.000Z',
              reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
            },
            changeReason: 'Updated reason',
          },
        },
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: 'Updated reason',
            cbcDataId: 20,
          },
        },
        inputCbcProjectCommunities: {
          _projectId: 1,
          _communityIdsToAdd: expect.anything(),
          _communityIdsToArchive: [],
        },
      }
    );

    pageTestingHelper.environment.mock.resolveMostRecentOperation({
      data: {
        updateCbcDataAndInsertChangeReason: {
          cbcData: {
            rowId: 1,
          },
        },
      },
    });
  });
});
