/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import { performQuery } from '../../../../backend/lib/graphql';
import {
  regenerateGcpeReport,
  generateGcpeReport,
  compareAndGenerateGcpeReport,
  compareGcpeReports,
} from '../../../../backend/lib/reporting/gcpe';
import {
  cbcDataQueryResult,
  ccbcDataQueryResult,
  generateAndCompareQueryResult,
  regenerateGcpeReportQueryResult,
} from './testData';

jest.mock('../../../../backend/lib/graphql');

describe('Gcpe reporting functions', () => {
  it('should regenerate a gcpe report', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return regenerateGcpeReportQueryResult;
    });
    const blob = await regenerateGcpeReport(1, null);
    expect(blob).toBeDefined();
  });

  it('should generate a gcpe report with cbc data', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return cbcDataQueryResult;
    });
    const blob = await generateGcpeReport(null);
    expect(blob).toBeDefined();
  });

  it('should generate a gcpe report with ccbc data', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return ccbcDataQueryResult;
    });
    const blob = await generateGcpeReport(null);
    expect(blob).toBeDefined();
  });

  it('should generate a gcpe report with ccbc data without announced by province', async () => {
    const modifiedCcbcDataQueryResult = {
      ...ccbcDataQueryResult,
      data: {
        ...ccbcDataQueryResult.data,
        allApplications: {
          ...ccbcDataQueryResult.data.allApplications,
          edges: ccbcDataQueryResult.data.allApplications.edges.map((edge) => ({
            ...edge,
            node: {
              ...edge.node,
              applicationAnnouncedsByApplicationId: null,
            },
          })),
        },
      },
    };
    mocked(performQuery).mockImplementation(async () => {
      return modifiedCcbcDataQueryResult;
    });
    const blob = await generateGcpeReport(null);
    expect(blob).toBeDefined();
  });

  it('should compare and generate a report', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return generateAndCompareQueryResult;
    });
    const blob = await compareAndGenerateGcpeReport(1, null);
    expect(blob).toBeDefined();
  });

  it('should compare gcpeReports', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return regenerateGcpeReportQueryResult;
    });
    const blob = await compareGcpeReports(1, 2, null);
    expect(blob).toBeDefined();
  });

  it('should return BC for CCBC with Agreement Signed status and BC funding only', async () => {
    const modifiedCcbcDataQueryResult = {
      ...ccbcDataQueryResult,
      data: {
        ...ccbcDataQueryResult.data,
        allApplications: {
          ...ccbcDataQueryResult.data.allApplications,
          edges: ccbcDataQueryResult.data.allApplications.edges.map((edge) => ({
            ...edge,
            node: {
              ...edge.node,
              analystStatus: 'approved',
              applicationSowDataByApplicationId: {
                nodes: [
                  {
                    sowTab7SBySowId: {
                      nodes: [
                        {
                          jsonData: {
                            summaryTable: {
                              amountRequestedFromProvince: 100000,
                              amountRequestedFromFederalGovernment: 0,
                            },
                          },
                        },
                      ],
                      totalCount: 1,
                    },
                  },
                ],
                totalCount: 1,
              },
            },
          })),
        },
      },
    };
    mocked(performQuery).mockImplementation(async () => {
      return modifiedCcbcDataQueryResult;
    });
    const result = await generateGcpeReport(null);
    expect(result.blob).toBeDefined();
  });

  it('should return ISED for CCBC with Agreement Signed status and ISED funding only', async () => {
    const modifiedCcbcDataQueryResult = {
      ...ccbcDataQueryResult,
      data: {
        ...ccbcDataQueryResult.data,
        allApplications: {
          ...ccbcDataQueryResult.data.allApplications,
          edges: ccbcDataQueryResult.data.allApplications.edges.map((edge) => ({
            ...edge,
            node: {
              ...edge.node,
              analystStatus: 'approved',
              applicationSowDataByApplicationId: {
                nodes: [
                  {
                    sowTab7SBySowId: {
                      nodes: [
                        {
                          jsonData: {
                            summaryTable: {
                              amountRequestedFromProvince: 0,
                              amountRequestedFromFederalGovernment: 150000,
                            },
                          },
                        },
                      ],
                      totalCount: 1,
                    },
                  },
                ],
                totalCount: 1,
              },
            },
          })),
        },
      },
    };
    mocked(performQuery).mockImplementation(async () => {
      return modifiedCcbcDataQueryResult;
    });
    const result = await generateGcpeReport(null);
    expect(result.blob).toBeDefined();
  });

  it('should return BC & ISED for CCBC with Agreement Signed status and both BC and ISED funding', async () => {
    const modifiedCcbcDataQueryResult = {
      ...ccbcDataQueryResult,
      data: {
        ...ccbcDataQueryResult.data,
        allApplications: {
          ...ccbcDataQueryResult.data.allApplications,
          edges: ccbcDataQueryResult.data.allApplications.edges.map((edge) => ({
            ...edge,
            node: {
              ...edge.node,
              analystStatus: 'approved',
              applicationSowDataByApplicationId: {
                nodes: [
                  {
                    sowTab7SBySowId: {
                      nodes: [
                        {
                          jsonData: {
                            summaryTable: {
                              amountRequestedFromProvince: 100000,
                              amountRequestedFromFederalGovernment: 150000,
                            },
                          },
                        },
                      ],
                      totalCount: 1,
                    },
                  },
                ],
                totalCount: 1,
              },
            },
          })),
        },
      },
    };
    mocked(performQuery).mockImplementation(async () => {
      return modifiedCcbcDataQueryResult;
    });
    const result = await generateGcpeReport(null);
    expect(result.blob).toBeDefined();
  });
});
