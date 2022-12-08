import { screen } from '@testing-library/react';
import RFI from 'pages/analyst/application/[applicationId]/rfi';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledRfiQuery, { rfiQuery } from '__generated__/rfiQuery.graphql';

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
                  rfiDataStatusTypeByRfiDataStatusTypeId: {
                    name: 'draft',
                  },
                },
              },
            },
          ],
        },
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
    expect(screen.getAllByText('Not received')[0]).toBeVisible();
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

    expect(screen.getAllByText('Add file')[0]).toHaveStyle({
      backgroundColor: '#003366',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
