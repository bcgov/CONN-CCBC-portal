import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import Utilities from 'pages/analyst/admin/utilities';
import compiledUtilitiesQuery, {
  utilitiesQuery,
} from '__generated__/utilitiesQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import {
  checkTabStyles,
  checkRouteAuthorization,
} from './shared-admin-tests';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
      allApplications: {
        edges: [
          {
            node: {
              rowId: 1,
              ccbcNumber: 'CCBC-010001',
              projectName: 'Test Project 1',
              organizationName: 'Test Org 1',
              projectInformation: {
                jsonData: {
                  statementOfWorkUpload: [
                    {
                      uuid: 'test-uuid-1',
                      name: 'test-sow-1.xlsx',
                    },
                  ],
                },
              },
              changeRequestDataByApplicationId: {
                edges: [],
              },
              applicationSowDataByApplicationId: {
                nodes: [
                  {
                    amendmentNumber: 0,
                    rowId: 1,
                    jsonData: {
                      organizationName: 'Test Org 1',
                      projectTitle: 'Test Project 1',
                      province: 'BC',
                      ccbc_number: 'CCBC-010001',
                      effectiveStartDate: '2023-01-01T00:00:00.000Z',
                      projectStartDate: '2023-06-01T00:00:00.000Z',
                      projectCompletionDate: '2025-12-31T00:00:00.000Z',
                      backboneFibre: true,
                      backboneMicrowave: false,
                      backboneSatellite: false,
                      lastMileFibre: true,
                      lastMileCable: false,
                      lastMileDSL: false,
                      lastMileMobileWireless: false,
                      lastMileFixedWireless: false,
                      lastMileSatellite: false,
                      isReimport: false,
                    },
                    sowTab1SBySowId: {
                      nodes: [
                        {
                          rowId: 1,
                          jsonData: {
                            numberOfHouseholds: 100,
                            householdsImpactedIndigenous: 50,
                            totalNumberCommunitiesImpacted: 2,
                            communityData: [],
                          },
                        },
                      ],
                    },
                    sowTab2SBySowId: {
                      nodes: [
                        {
                          rowId: 1,
                          jsonData: [
                            {
                              entryNumber: 1,
                              projectSiteName: 'Site 1',
                            },
                          ],
                        },
                      ],
                    },
                    sowTab7SBySowId: {
                      nodes: [
                        {
                          rowId: 1,
                          jsonData: {
                            summaryTable: {
                              totalProjectCost: 1000000,
                            },
                          },
                        },
                      ],
                    },
                    sowTab8SBySowId: {
                      nodes: [
                        {
                          rowId: 1,
                          jsonData: {
                            communitiesNumber: 2,
                            indigenousCommunitiesNumber: 1,
                            geoNames: [],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              rowId: 2,
              ccbcNumber: 'CCBC-010002',
              projectName: 'Test Project 2',
              organizationName: 'Test Org 2',
              projectInformation: {
                jsonData: {
                  statementOfWorkUpload: [],
                },
              },
              changeRequestDataByApplicationId: {
                edges: [
                  {
                    node: {
                      amendmentNumber: 1,
                      jsonData: {
                        statementOfWorkUpload: [
                          {
                            uuid: 'test-uuid-2',
                            name: 'test-sow-2.xlsx',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
              applicationSowDataByApplicationId: {
                nodes: [],
              },
            },
          },
        ],
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<utilitiesQuery>({
  pageComponent: Utilities,
  compiledQuery: compiledUtilitiesQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

// Mock fetch
global.fetch = jest.fn();

describe('The Utilities admin page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/utilities',
    });
    (global.fetch as jest.Mock).mockClear();
  });

  // Shared admin dashboard pages route authorization tests
  checkRouteAuthorization();

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    // Check if the Utilities heading is visible
    expect(screen.getByRole('heading', { name: 'Utilities' })).toBeVisible();
    expect(screen.getByText('SOW Re-importer')).toBeVisible();
  });

  it('displays the project dropdown with projects that have SOW uploaded', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');
    expect(dropdown).toBeInTheDocument();

    // Should show both projects (one with original SOW, one with amendment SOW)
    expect(
      screen.getByRole('option', { name: /CCBC-010001 - Test Project 1/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /CCBC-010002 - Test Project 2/ })
    ).toBeInTheDocument();
  });

  it('shows SOW info when a project is selected', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    // Should show SOW type and file info
    expect(screen.getByText('SOW Type:')).toBeInTheDocument();
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('test-sow-1.xlsx')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Re-import' })).toBeInTheDocument();
  });

  it('shows amendment info for projects with change requests', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '2' } });
    });

    // Should show amendment info
    expect(screen.getByText('SOW Type:')).toBeInTheDocument();
    expect(screen.getByText('Amendment #1')).toBeInTheDocument();
    expect(screen.getByText('test-sow-2.xlsx')).toBeInTheDocument();
  });

  it('clears validation errors and messages when changing projects', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    // Select first project
    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    // Select second project
    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '2' } });
    });

    // Should show new project info
    expect(screen.getByText('Amendment #1')).toBeInTheDocument();
  });

  it('disables the button while re-importing', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });
    expect(reimportButton).not.toBeDisabled();

    // Mock fetch responses with delayed resolution to capture loading state
    let resolveDownload: (value: any) => void;
    const downloadPromise = new Promise((resolve) => {
      resolveDownload = resolve;
    });

    (global.fetch as jest.Mock)
      .mockReturnValueOnce(downloadPromise)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          validatedData: {
            summary: {
              _jsonData: {
                organizationName: 'Different Org',
                projectTitle: 'Different Project',
                province: 'BC',
                ccbc_number: 'CCBC-010001',
                effectiveStartDate: '2023-01-01T00:00:00.000Z',
                projectStartDate: '2023-06-01T00:00:00.000Z',
                projectCompletionDate: '2025-12-31T00:00:00.000Z',
                backboneFibre: true,
                backboneMicrowave: false,
                backboneSatellite: false,
                lastMileFibre: true,
                lastMileCable: false,
                lastMileDSL: false,
                lastMileMobileWireless: false,
                lastMileFixedWireless: false,
                lastMileSatellite: false,
              },
            },
            tab1: {},
            tab2: [],
            tab7: {},
            tab8: {},
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: { data: { createApplicationSowData: {} } },
        }),
      });

    act(() => {
      fireEvent.click(reimportButton);
    });

    // Button should be disabled while loading
    await waitFor(() => {
      expect(reimportButton).toBeDisabled();
    });

    // Resolve the download to complete the process
    await act(async () => {
      resolveDownload({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      });
    });
  });

  it('shows success toast after successful import', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch responses for successful import
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          validatedData: {
            summary: {
              _jsonData: {
                organizationName: 'Different Org',
                projectTitle: 'Test Project 1',
                province: 'BC',
                ccbc_number: 'CCBC-010001',
                effectiveStartDate: '2023-01-01T00:00:00.000Z',
                projectStartDate: '2023-06-01T00:00:00.000Z',
                projectCompletionDate: '2025-12-31T00:00:00.000Z',
                backboneFibre: true,
                backboneMicrowave: false,
                backboneSatellite: false,
                lastMileFibre: true,
                lastMileCable: false,
                lastMileDSL: false,
                lastMileMobileWireless: false,
                lastMileFixedWireless: false,
                lastMileSatellite: false,
              },
            },
            tab1: {},
            tab2: [],
            tab7: {},
            tab8: {},
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: { data: { createApplicationSowData: {} } },
        }),
      });

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Statement of work successfully imported')
      ).toBeInTheDocument();
    });
  });

  it('shows exact match message when data is identical', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch responses for exact match
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          validatedData: {
            summary: {
              _jsonData: {
                organizationName: 'Test Org 1',
                projectTitle: 'Test Project 1',
                province: 'BC',
                ccbc_number: 'CCBC-010001',
                effectiveStartDate: '2023-01-01T00:00:00.000Z',
                projectStartDate: '2023-06-01T00:00:00.000Z',
                projectCompletionDate: '2025-12-31T00:00:00.000Z',
                backboneFibre: true,
                backboneMicrowave: false,
                backboneSatellite: false,
                lastMileFibre: true,
                lastMileCable: false,
                lastMileDSL: false,
                lastMileMobileWireless: false,
                lastMileFixedWireless: false,
                lastMileSatellite: false,
              },
            },
            tab1: {
              numberOfHouseholds: 100,
              householdsImpactedIndigenous: 50,
              totalNumberCommunitiesImpacted: 2,
              communityData: [],
            },
            tab2: [
              {
                entryNumber: 1,
                projectSiteName: 'Site 1',
              },
            ],
            tab7: {
              summaryTable: {
                totalProjectCost: 1000000,
              },
            },
            tab8: {
              communitiesNumber: 2,
              indigenousCommunitiesNumber: 1,
              geoNames: [],
            },
          },
        }),
      });

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Data is an exact match. No re-import needed.')
      ).toBeInTheDocument();
    });
  });

  it('disables button permanently after successful import', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch responses for successful import
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          validatedData: {
            summary: {
              _jsonData: {
                organizationName: 'Different Org',
                projectTitle: 'Test Project 1',
                province: 'BC',
                ccbc_number: 'CCBC-010001',
                effectiveStartDate: '2023-01-01T00:00:00.000Z',
                projectStartDate: '2023-06-01T00:00:00.000Z',
                projectCompletionDate: '2025-12-31T00:00:00.000Z',
                backboneFibre: true,
                backboneMicrowave: false,
                backboneSatellite: false,
                lastMileFibre: true,
                lastMileCable: false,
                lastMileDSL: false,
                lastMileMobileWireless: false,
                lastMileFixedWireless: false,
                lastMileSatellite: false,
              },
            },
            tab1: {},
            tab2: [],
            tab7: {},
            tab8: {},
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: { data: { createApplicationSowData: {} } },
        }),
      });

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Statement of work successfully imported')
      ).toBeInTheDocument();
    });

    // Button should be permanently disabled
    await waitFor(() => {
      expect(reimportButton).toBeDisabled();
    });

    // Should show refresh message
    await waitFor(() => {
      expect(
        screen.getByText(
          'For data consistency, please refresh the page to run another re-import'
        )
      ).toBeInTheDocument();
    });

    // Even when changing projects, button should stay disabled
    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '2' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Re-import' })).toBeDisabled();
    });
  });

  it('displays validation errors when upload fails', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch responses for validation error
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => [
          {
            level: 'workbook',
            error: 'Missing required sheet',
          },
        ],
      });

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Missing required sheet/)).toBeInTheDocument();
    });
  });

  it('handles file download errors gracefully', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch to fail on download
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Download failed')
    );

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred during re-import/)
      ).toBeInTheDocument();
    });
  });

  it('ignores isReimport field in comparison', async () => {
    const mockPayloadWithReimport = {
      Query() {
        return {
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
            authRole: 'ccbc_admin',
          },
          allApplications: {
            edges: [
              {
                node: {
                  rowId: 1,
                  ccbcNumber: 'CCBC-010001',
                  projectName: 'Test Project 1',
                  organizationName: 'Test Org 1',
                  projectInformation: {
                    jsonData: {
                      statementOfWorkUpload: [
                        {
                          uuid: 'test-uuid-1',
                          name: 'test-sow-1.xlsx',
                        },
                      ],
                    },
                  },
                  changeRequestDataByApplicationId: {
                    edges: [],
                  },
                  applicationSowDataByApplicationId: {
                    nodes: [
                      {
                        amendmentNumber: 0,
                        rowId: 1,
                        jsonData: {
                          organizationName: 'Test Org 1',
                          projectTitle: 'Test Project 1',
                          province: 'BC',
                          ccbc_number: 'CCBC-010001',
                          effectiveStartDate: '2023-01-01T00:00:00.000Z',
                          projectStartDate: '2023-06-01T00:00:00.000Z',
                          projectCompletionDate: '2025-12-31T00:00:00.000Z',
                          backboneFibre: true,
                          backboneMicrowave: false,
                          backboneSatellite: false,
                          lastMileFibre: true,
                          lastMileCable: false,
                          lastMileDSL: false,
                          lastMileMobileWireless: false,
                          lastMileFixedWireless: false,
                          lastMileSatellite: false,
                          isReimport: true, // This should be ignored in comparison
                        },
                        sowTab1SBySowId: {
                          nodes: [
                            {
                              rowId: 1,
                              jsonData: {
                                numberOfHouseholds: 100,
                                householdsImpactedIndigenous: 50,
                                totalNumberCommunitiesImpacted: 2,
                                communityData: [],
                              },
                            },
                          ],
                        },
                        sowTab2SBySowId: {
                          nodes: [
                            {
                              rowId: 1,
                              jsonData: [
                                {
                                  entryNumber: 1,
                                  projectSiteName: 'Site 1',
                                },
                              ],
                            },
                          ],
                        },
                        sowTab7SBySowId: {
                          nodes: [
                            {
                              rowId: 1,
                              jsonData: {
                                summaryTable: {
                                  totalProjectCost: 1000000,
                                },
                              },
                            },
                          ],
                        },
                        sowTab8SBySowId: {
                          nodes: [
                            {
                              rowId: 1,
                              jsonData: {
                                communitiesNumber: 2,
                                indigenousCommunitiesNumber: 1,
                                geoNames: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        };
      },
    };

    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/admin/utilities',
    });
    pageTestingHelper.loadQuery(mockPayloadWithReimport);
    pageTestingHelper.renderPage();

    const dropdown = screen.getByLabelText('Select a CCBC Project:');

    await act(async () => {
      fireEvent.change(dropdown, { target: { value: '1' } });
    });

    const reimportButton = screen.getByRole('button', { name: 'Re-import' });

    // Mock fetch responses - validated data doesn't have isReimport
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => new Blob(['test'], { type: 'application/vnd.ms-excel' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          validatedData: {
            summary: {
              _jsonData: {
                organizationName: 'Test Org 1',
                projectTitle: 'Test Project 1',
                province: 'BC',
                ccbc_number: 'CCBC-010001',
                effectiveStartDate: '2023-01-01T00:00:00.000Z',
                projectStartDate: '2023-06-01T00:00:00.000Z',
                projectCompletionDate: '2025-12-31T00:00:00.000Z',
                backboneFibre: true,
                backboneMicrowave: false,
                backboneSatellite: false,
                lastMileFibre: true,
                lastMileCable: false,
                lastMileDSL: false,
                lastMileMobileWireless: false,
                lastMileFixedWireless: false,
                lastMileSatellite: false,
                // No isReimport field
              },
            },
            tab1: {
              numberOfHouseholds: 100,
              householdsImpactedIndigenous: 50,
              totalNumberCommunitiesImpacted: 2,
              communityData: [],
            },
            tab2: [
              {
                entryNumber: 1,
                projectSiteName: 'Site 1',
              },
            ],
            tab7: {
              summaryTable: {
                totalProjectCost: 1000000,
              },
            },
            tab8: {
              communitiesNumber: 2,
              indigenousCommunitiesNumber: 1,
              geoNames: [],
            },
          },
        }),
      });

    await act(async () => {
      fireEvent.click(reimportButton);
    });

    // Should show exact match message even though existing has isReimport:true
    await waitFor(() => {
      expect(
        screen.getByText('Data is an exact match. No re-import needed.')
      ).toBeInTheDocument();
    });
  });
});

