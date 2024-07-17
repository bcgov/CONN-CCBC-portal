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

    pageTestingHelper.expectMutationToBeCalled('updateCbcDataByRowIdMutation', {
      input: {
        rowId: 1,
        cbcDataPatch: {
          jsonData: {
            projectNumber: 5555,
            phase: 2,
            intake: 1,
            projectStatus: 'Reporting Complete',
            projectTitle: 'Project 1',
            changeRequestPending: 'No',
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
            lastReviewed: '2023-07-11T00:00:00.000Z',
            reviewNotes: 'Qtrly Report: Progress 0.39 -> 0.38',
          },
        },
      },
    });
  });

  it('should have the correct validation errors for tombstone projectStatus', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockQueryPayload);
    pageTestingHelper.renderPage();

    const projectStatusElement = screen.getByTestId(
      'root_tombstone_projectStatus-value'
    );
    expect(projectStatusElement).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = projectStatusElement.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing project status/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for tombstone federal project number', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    pageTestingHelper.loadQuery(mockQueryPayload);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_tombstone_federalProjectNumber-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing Federal project number/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for tombstone federal project number format for UBF', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadUBF = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      federalFundingSource: 'ISED-UBF',
                      federalProjectNumber: '1234',
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadUBF);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_tombstone_federalProjectNumber-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(
      /UBF project numbers must begin with 'UBF-'/
    );
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for tombstone federal project number format for CTI', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadUBF = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      federalFundingSource: 'ISED-CTI',
                      federalProjectNumber: '1234',
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadUBF);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_tombstone_federalProjectNumber-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(
      /CTI project numbers must begin with 'CTI-'/
    );
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for miscellaneous', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      projectMilestoneCompleted: 1,
                      constructionCompletedOn: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_miscellaneous_projectMilestoneCompleted-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing date/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for events and dates', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      dateAnnounced: null,
                      reportingCompletionDate: null,
                      dateConditionallyApproved: '2024-06-26T00:00:00.000Z',
                      agreementSigned: 'YES',
                      conditionalApprovalLetterSent: 'YES',
                      dateAgreementSigned: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const elementDateAnnounced = screen.getByTestId(
      'root_eventsAndDates_dateAnnounced-value'
    );
    expect(elementDateAnnounced).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon1 = elementDateAnnounced.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon1).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon1);
    const tooltip1 = await screen.findByText(/Missing date announced/);
    expect(tooltip1).toBeInTheDocument();

    const elementReportingCompletion = screen.getByTestId(
      'root_eventsAndDates_reportingCompletionDate-value'
    );
    expect(elementReportingCompletion).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon2 = elementReportingCompletion.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon2).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(
      /Missing reporting completion date/
    );
    expect(tooltip2).toBeInTheDocument();

    const elementProposedCompletionDate = screen.getByTestId(
      'root_eventsAndDates_proposedCompletionDate-value'
    );
    expect(elementProposedCompletionDate).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon3 = elementProposedCompletionDate.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon3).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon3);
    const tooltip3 = await screen.findByText(
      /Please review Proposed Completion Date accuracy in relation to Date Conditionally Approved and Proposed Start Date/
    );
    expect(tooltip3).toBeInTheDocument();

    const elementDateAgreementSigned = screen.getByTestId(
      'root_eventsAndDates_dateAgreementSigned-value'
    );
    expect(elementDateAgreementSigned).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon4 = elementDateAgreementSigned.querySelector(
      '[data-testid="HelpIcon"]'
    );
    expect(helpIcon4).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon4);
    const tooltip4 = await screen.findByText(/Missing date agreement signed/);
    expect(tooltip4).toBeInTheDocument();
  });

  it('should have the correct validation errors for funding', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      bcFundingRequested: 100000,
                      federalFundingRequested: 555555,
                      totalProjectBudget: 5555555,
                      federalFundingSource: null,
                      applicantAmount: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId('root_funding_totalProjectBudget-value');
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(
      /Total project budget must equal the sum of the funding sources/
    );
    expect(tooltip).toBeInTheDocument();

    const element2 = screen.getByTestId(
      'root_funding_federalFundingRequested-value'
    );
    expect(element2).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon2 = element2.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(/Missing Federal funding source/);
    expect(tooltip2).toBeInTheDocument();

    const element3 = screen.getByTestId('root_funding_applicantAmount-value');
    expect(element3).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon3 = element3.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon3);
    const tooltip3 = await screen.findByText(/Please enter a value/);
    expect(tooltip3).toBeInTheDocument();
  });

  it('should have the correct validation errors for locations and counts transport kms', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      indigenousCommunities: 6,
                      communitiesAndLocalesCount: 5,
                      projectType: 'Transport',
                      transportKm: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_locationsAndCounts_indigenousCommunities-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(
      /Indigenous communities cannot be greater than total communities/
    );
    expect(tooltip).toBeInTheDocument();

    const element2 = screen.getByTestId(
      'root_locationsAndCounts_transportKm-value'
    );
    expect(element2).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon2 = element2.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon2).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon2);
    const tooltip2 = await screen.findByText(/Missing transport KMs/);
    expect(tooltip2).toBeInTheDocument();
  });

  it('should have the correct validation errors for locations and counts highway kms', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      indigenousCommunities: 6,
                      communitiesAndLocalesCount: 5,
                      projectType: 'Cellular',
                      highwayKm: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_locationsAndCounts_highwayKm-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing highway KMs/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for project type and last mile project Type', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      projectType: 'Last-Mile',
                      lastMileProjectType: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_projectType_lastMileProjectType-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing Last-Mile project type/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for project type and highway project Type', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      projectType: 'Cellular',
                      highwayProjectType: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_projectType_highwayProjectType-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing highway project type/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should have the correct validation errors for project type and transport project Type', async () => {
    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockShowCbcEdit);
    const mockQueryPayloadMisc = {
      Query() {
        return {
          ...mockQueryPayload.Query(),
          cbcByRowId: {
            ...mockQueryPayload.Query().cbcByRowId,
            cbcDataByCbcId: {
              ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId,
              edges: [
                {
                  node: {
                    ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                      .edges[0].node,
                    jsonData: {
                      ...mockQueryPayload.Query().cbcByRowId.cbcDataByCbcId
                        .edges[0].node.jsonData,
                      projectType: 'Transport',
                      transportProjectType: null,
                    },
                  },
                },
              ],
            },
          },
        };
      },
    };
    pageTestingHelper.loadQuery(mockQueryPayloadMisc);
    pageTestingHelper.renderPage();

    const element = screen.getByTestId(
      'root_projectType_transportProjectType-value'
    );
    expect(element).toHaveStyle({
      backgroundColor: 'rgb(248, 231, 143)',
    });
    const helpIcon = element.querySelector('[data-testid="HelpIcon"]');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpIcon);
    const tooltip = await screen.findByText(/Missing Transport project type/);
    expect(tooltip).toBeInTheDocument();
  });
});
