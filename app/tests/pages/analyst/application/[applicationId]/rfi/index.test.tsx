import { act, fireEvent, screen } from '@testing-library/react';
import RFI from 'pages/analyst/application/[applicationId]/rfi';
import allApplicationStatusTypes from 'tests/utils/mockStatusTypes';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledRfiQuery, { rfiQuery } from '__generated__/rfiQuery.graphql';
import { CCBC_ASSESSMENT_RFI_INSTRUCTIONS } from 'data/externalConstants';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        applicationRfiDataByApplicationId: {
          edges: [
            {
              node: {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Missing files or information'],
                    rfiDueBy: '2022-12-03',
                    rfiAdditionalFiles: {
                      detailedBudgetRfi: true,
                    },
                    rfiEmailCorrespondance: [
                      {
                        id: 7,
                        name: 'test.xls',
                        size: 0,
                        type: 'application/vnd.ms-excel',
                        uuid: '4e27e513-6c56-4e5b-81d6-a14fa5f7eae3',
                      },
                    ],
                  },
                  rowId: 4,
                  rfiNumber: 'CCBC-010001-1',
                  rfiDataStatusTypeByRfiDataStatusTypeId: {
                    name: 'draft',
                  },
                  archivedAt: null,
                },
              },
            },
            {
              node: {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Technical', 'Missing files or information'],
                    rfiDueBy: '2022-11-28',
                    rfiAdditionalFiles: {
                      equipmentDetailsRfi: true,
                      geographicCoverageMapRfi: true,
                      preparedFinancialStatementsRfi: true,
                      upgradedNetworkInfrastructureRfi: true,
                      eligibilityAndImpactsCalculatorRfi: true,
                      communityRuralDevelopmentBenefitsTemplateRfi: true,
                      equipmentDetails: [
                        {
                          id: 7,
                          name: 'test 3.xls',
                          size: 0,
                          type: 'application/vnd.ms-excel',
                          uuid: 'cb219e12-2b8b-4ba9-be7d-b4af4d1caa5b',
                        },
                      ],
                    },
                    rfiEmailCorrespondance: [
                      {
                        id: 6,
                        name: 'test 2.xls',
                        size: 0,
                        type: 'application/vnd.ms-excel',
                        uuid: 'cb219e12-2b8b-4ba9-be7d-b4af4d1caa5b',
                      },
                    ],
                  },
                  rowId: 3,
                  rfiNumber: 'CCBC-010001-2',
                  archivedAt: null,
                  rfiDataStatusTypeByRfiDataStatusTypeId: {
                    name: 'draft',
                  },
                },
              },
            },
            {
              node: {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Technical', 'Missing files or information'],
                    rfiDueBy: '2022-11-28',
                    rfiAdditionalFiles: {
                      equipmentDetailsRfi: true,
                      geographicCoverageMapRfi: true,
                      preparedFinancialStatementsRfi: true,
                      upgradedNetworkInfrastructureRfi: true,
                      eligibilityAndImpactsCalculatorRfi: true,
                      communityRuralDevelopmentBenefitsTemplateRfi: true,
                      equipmentDetails: [
                        {
                          id: 7,
                          name: 'test 3.xls',
                          size: 0,
                          type: 'application/vnd.ms-excel',
                          uuid: 'cb219e12-2b8b-4ba9-be7d-b4af4d1caa5b',
                        },
                      ],
                    },
                    rfiEmailCorrespondance: [
                      {
                        id: 6,
                        name: 'test 2.xls',
                        size: 0,
                        type: 'application/vnd.ms-excel',
                        uuid: 'cb219e12-2b8b-4ba9-be7d-b4af4d1caa5b',
                      },
                    ],
                  },
                  rowId: 3,
                  rfiNumber: 'CCBC-010001-2',
                  archivedAt: 'just about anything',
                  rfiDataStatusTypeByRfiDataStatusTypeId: {
                    name: 'draft',
                  },
                },
              },
            },
          ],
        },
      },
      allApplicationStatusTypes: {
        ...allApplicationStatusTypes,
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
    };
  },
};

const rfiMutationInput = {
  input: {
    id: '<RfiData-mock-id-1>',
    rfiDataPatch: {
      jsonData: {
        rfiType: ['Missing files or information'],
        rfiAdditionalFiles: {
          detailedBudgetRfi: true,
        },
        rfiDueBy: '2022-12-03',
        rfiEmailCorrespondance: [
          {
            id: 7,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: '4e27e513-6c56-4e5b-81d6-a14fa5f7eae3',
          },
          {
            id: 1,
            uuid: 'string',
            name: 'test-file.kmz',
            size: 1,
            type: 'application/vnd.google-earth.kmz',
            uploadedAt: expect.any(String),
          },
        ],
      },
    },
  },
};

const pageTestingHelper = new PageTestingHelper<rfiQuery>({
  pageComponent: RFI,
  compiledQuery: compiledRfiQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'RFI' })).toBeVisible();
  });

  it('displays the guide', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const linkElement = screen.getByRole('link', { name: /Guide/ });

    expect(linkElement).toBeVisible();
    expect(linkElement).toHaveAttribute(
      'href',
      CCBC_ASSESSMENT_RFI_INSTRUCTIONS
    );
  });

  it('displays the New RFI button', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('button', {
        name: 'New RFI',
      })
    ).toBeVisible();
  });

  it('lists the RFIs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'CCBC-010001-1' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'CCBC-010001-2' })
    ).toBeVisible();
  });

  it('shows all of the correct RFI fields', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('RFI type')[0]).toBeVisible();
    expect(screen.getAllByText('Due by')[0]).toBeVisible();
    expect(screen.getAllByText('Email correspondence')[0]).toBeVisible();
    expect(
      screen.getByText('Template 1 - Eligibility and Impacts Calculator')
    ).toBeVisible();
    expect(screen.getByText('Template 2 - Detailed Budget')).toBeVisible();
    expect(screen.getByText('Financial statements')).toBeVisible();

    expect(screen.getByText('Template 10 - Equipment Details')).toBeVisible();
    expect(screen.getByText('Financial statements')).toBeVisible();
    expect(
      screen.getByText('Coverage map from Eligibility Mapping Tool')
    ).toBeVisible();
    expect(
      screen.getByText('Proposed or Upgraded Network Infrastructure')
    ).toBeVisible();
  });

  it('should show indications for template 1 and 2', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        /RFI upload for Template 1 automatically updates the data for Final Eligible Households and Indigenous/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /FI upload for Template 2 automatically updates the data for Total Eligible Costs and Total Project Costs/
      )
    ).toBeInTheDocument();
  });

  it('shows all of the correct Requested file items', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('Not received')[0]).toBeVisible();
    expect(screen.getByText('test 3.xls')).toBeVisible();
  });

  it('should have correct styles', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getAllByText('RFI type')[0]).toHaveStyle({
      fontWeight: 700,
    });

    expect(screen.getAllByText('Due by')[0]).toHaveStyle({
      fontWeight: 700,
    });

    expect(screen.getByText('test.xls')).toHaveStyle({
      color: '#1A5A96',
    });

    expect(
      document.getElementById('root_rfiEmailCorrespondance-btn')
    ).toHaveStyle({
      backgroundColor: '#003366',
    });
  });

  // Wrap file test in function to reuse
  const fileTest = async () => {
    const file = new File([new ArrayBuffer(1)], 'test-file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const inputFile = screen.getAllByTestId('file-test')[0];

    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    pageTestingHelper.expectMutationToBeCalled('createAttachmentMutation', {
      input: {
        attachment: {
          file,
          fileName: 'test-file.kmz',
          fileSize: '1 Bytes',
          fileType: 'application/vnd.google-earth.kmz',
          applicationId: 1,
        },
      },
    });

    expect(screen.getByLabelText('loading')).toBeVisible();

    await act(async () => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          createAttachment: {
            attachment: {
              rowId: 1,
              file: 'string',
            },
          },
        },
      });
    });
  };

  it('calls the correct mutations when uploading an email', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await fileTest();

    pageTestingHelper.expectMutationToBeCalled(
      'updateRfiJsonDataMutation',
      rfiMutationInput
    );
  });

  it('calls an error mutations when mutation fails', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const logSpy = jest.spyOn(console, 'log');

    await fileTest();

    pageTestingHelper.expectMutationToBeCalled(
      'updateRfiJsonDataMutation',
      rfiMutationInput
    );

    act(() => {
      pageTestingHelper.environment.mock.rejectMostRecentOperation(new Error());
    });

    expect(logSpy).toHaveBeenCalledWith('Error updating RFI', new Error());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
