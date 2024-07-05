import Cbc from 'pages/analyst/cbc/[cbcId]';
import { act, fireEvent, screen } from '@testing-library/react';
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

const cbcJsonData = {
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
  locked: false,
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
                jsonData: cbcJsonData,
                sharepointTimestamp: '2024-10-01T00:00:00.000Z',
                rowId: 1,
                projectNumber: 5555,
                updatedAt: '2024-10-01T00:00:00.000Z',
                updatedBy: 'test',
              },
            },
          ],
        },
        cbcProjectCommunitiesByCbcId: {
          nodes: [
            {
              communitiesSourceDataByCommunitiesSourceDataId: {
                economicRegion: 'Economic Region 1',
                geographicNameId: 1,
                geographicType: 'Geographic Type 1',
                regionalDistrict: 'Regional District 1',
                bcGeographicName: 'BC Geographic Name 1',
              },
            },
            {
              communitiesSourceDataByCommunitiesSourceDataId: {
                economicRegion: 'Economic Region 1',
                geographicNameId: 1,
                geographicType: 'Geographic Type 2',
                regionalDistrict: 'Regional District 2',
                bcGeographicName: 'BC Geographic Name 2',
              },
            },
            {
              communitiesSourceDataByCommunitiesSourceDataId: {
                economicRegion: 'Economic Region 2',
                geographicNameId: 2,
                geographicType: 'Geographic Type 2',
                regionalDistrict: 'Regional District 1',
                bcGeographicName: 'BC Geographic Name 3',
              },
            },
          ],
        },
      },
      session: {
        authRole: 'cbc_admin',
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'cbc_admin',
      },
    };
  },
};

const mockNonCbcQueryPayload = {
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
                jsonData: cbcJsonData,
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
        authRole: 'ccbc_admin',
      },
    };
  },
};

const mockLockedQueryPayload = {
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
                jsonData: { ...cbcJsonData, locked: true },
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
        authRole: 'cbc_admin',
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
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    // right side (editable) of header
    expect(screen.getByLabelText('External Status')).toBeInTheDocument();
    expect(screen.getByLabelText('External Status')).toHaveValue('complete');
    expect(screen.getByLabelText('Project Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Type')).toHaveValue('Transport');
  });

  it('header should be editable for cbc admin', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const options = screen.getAllByRole('option');
    options.forEach((option) => {
      expect(option).toBeEnabled();
    });

    const projectTypeInput = screen.getByLabelText('Project Type');
    expect(projectTypeInput).toBeEnabled();

    await act(async () => {
      fireEvent.change(projectTypeInput, { target: { value: 'Telecom' } });
    });

    pageTestingHelper.expectMutationToBeCalled('updateCbcDataByRowIdMutation', {
      input: expect.any(Object),
    });

    const projectDescriptionField = screen.getByText('Description 1');
    await act(async () => {
      fireEvent.click(projectDescriptionField);
    });
    const projectDescriptionInput = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(projectDescriptionInput, {
        target: { value: 'testing edit 2' },
      });
    });

    pageTestingHelper.expectMutationToBeCalled('updateCbcDataByRowIdMutation', {
      input: expect.any(Object),
    });
  });

  it('header should not be editable by non cbc admin users', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockNonCbcQueryPayload);
    pageTestingHelper.renderPage();

    const options = screen.getAllByRole('option');
    options.forEach((option) => {
      expect(option).toBeDisabled();
    });
  });

  it('header should not be editable when record locked', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockLockedQueryPayload);
    pageTestingHelper.renderPage();

    const options = screen.getAllByRole('option');
    options.forEach((option) => {
      expect(option).toBeDisabled();
    });
  });

  it('accordions should not be editable when record locked', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockLockedQueryPayload);
    pageTestingHelper.renderPage();

    const accordionEditButton = screen.getByTestId('tombstone-lock-edit');
    expect(accordionEditButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(accordionEditButton);
    });

    expect(
      screen.getByText(
        'The project is currently locked for editing. Would you still like to continue?'
      )
    ).toBeInTheDocument();
  });

  it('should have the correct actions when edit enabled', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Expand all')).toBeInTheDocument();
    expect(screen.getByText('Collapse all')).toBeInTheDocument();
    expect(screen.getByText('Quick edit')).toBeInTheDocument();
  });

  it('should have the correct actions when record locked', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockLockedQueryPayload);
    pageTestingHelper.renderPage();

    expect(screen.getByText('Expand all')).toBeInTheDocument();
    expect(screen.getByText('Collapse all')).toBeInTheDocument();
    expect(screen.getByTestId('record-lock')).toBeInTheDocument();
  });

  it('should not have the quick edit actions when non cbc-admin', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockNonCbcQueryPayload);
    pageTestingHelper.renderPage();

    expect(screen.queryByText('Quick-edit')).not.toBeInTheDocument();
    expect(screen.queryByTestId('record-lock')).not.toBeInTheDocument();
  });

  it('accordions should not be editable when non cbc-admin', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockNonCbcQueryPayload);
    pageTestingHelper.renderPage();

    const accordionEditButton = screen.queryByText('Quick edit');
    expect(accordionEditButton).not.toBeInTheDocument();
  });

  it('expand and collapse all work as expected', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const expandButton = screen.getByRole('button', {
      name: 'Expand all',
    });
    act(() => {
      fireEvent.click(expandButton);
    });

    const collapseButton = screen.getByRole('button', {
      name: 'Collapse all',
    });
    act(() => {
      fireEvent.click(collapseButton);
    });
    // All accordions contain a table, so to find every collapsed portion we select them all
    const allHiddenDivs = screen
      .getAllByRole('table', {
        hidden: true,
      })
      .map((tableElement) => tableElement.parentElement);

    // attempt to find a div that would not be hidden
    const isAllHidden = allHiddenDivs.find((section) => {
      return section.style.display !== 'none';
    });
    // expect not to find one
    expect(isAllHidden).toBeUndefined();
  });

  it('should have the correct communities data', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    // left side of header
    expect(
      screen.getByText('Economic Region 1, Economic Region 2')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Regional District 1, Regional District 2')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'BC Geographic Name 1, BC Geographic Name 2, BC Geographic Name 3'
      )
    ).toBeInTheDocument();
  });

  it('should send the mutation on save', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const editButton = screen.getByRole('button', {
      name: 'Quick edit',
    });
    act(() => {
      fireEvent.click(editButton);
    });

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
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
          rowId: 1,
          cbcDataPatch: {
            jsonData: {
              projectNumber: 5555,
              phase: 2,
              intake: 1,
              projectStatus: 'Reporting Complete',
              changeRequestPending: 'No',
              projectTitle: 'Project 1',
              projectDescription: 'Description 1',
              applicantContractualName: 'Internet company 1',
              currentOperatingName: 'Internet company 1',
              eightThirtyMillionFunding: 'No',
              federalFundingSource: 'ISED-CTI',
              projectType: 'Transport',
              transportProjectType: 'Fibre',
              connectedCoastNetworkDependant: 'NO',
              projectLocations: 'Location 1',
              communitiesAndLocalesCount: 5,
              indigenousCommunities: 5,
              householdCount: null,
              transportKm: 124,
              highwayKm: null,
              bcFundingRequested: 5555555,
              federalFundingRequested: 555555,
              applicantAmount: 555555,
              otherFundingRequested: 265000,
              totalProjectBudget: 5555555,
              conditionalApprovalLetterSent: 'YES',
              agreementSigned: 'YES',
              announcedByProvince: 'YES',
              dateApplicationReceived: null,
              dateConditionallyApproved: '2019-06-26T00:00:00.000Z',
              dateAgreementSigned: '2021-02-24T00:00:00.000Z',
              proposedStartDate: '2020-07-01T00:00:00.000Z',
              proposedCompletionDate: '2023-03-31T00:00:00.000Z',
              reportingCompletionDate: null,
              dateAnnounced: '2019-07-02T00:00:00.000Z',
              projectMilestoneCompleted: 0.5,
              constructionCompletedOn: null,
              milestoneComments: 'Requested extension to March 31, 2024',
              primaryNewsRelease:
                'https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html',
              locked: false,
              lastReviewed: '2023-07-11T00:00:00.000Z',
              reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
            },
          },
        },
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: 'Updated reason',
            cbcDataId: 1,
          },
        },
      }
    );
  });

  it('should prompt confirmation on locked edit click', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockLockedQueryPayload);
    pageTestingHelper.renderPage();

    const editLockButton = screen.getByTestId('record-lock');
    act(() => {
      fireEvent.click(editLockButton);
    });

    const confirmButton = screen.getByRole('button', {
      name: 'Yes, edit',
    });

    expect(confirmButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(confirmButton);
    });

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
    expect(saveButton).toBeInTheDocument();
  });
});
