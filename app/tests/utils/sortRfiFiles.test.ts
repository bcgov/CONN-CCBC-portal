import sortRfiFiles from 'utils/sortRfiFiles';

const mockRfiNodes = [
  {
    node: {
      rfiDataByRfiDataId: {
        jsonData: {
          rfiType: ['Missing files or information'],
          rfiDueBy: '2023-08-05',
          rfiAdditionalFiles: {
            geographicCoverageMap: [
              {
                id: 35,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: '6c5328e2-2c64-4de1-921f-a289f57c1106',
              },
            ],
            geographicCoverageMapRfi: true,
            eligibilityAndImpactsCalculator: [
              {
                id: 34,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: '6287fd27-3994-4bf9-9a6b-2ad6d7b95abb',
              },
            ],
            eligibilityAndImpactsCalculatorRfi: true,
          },
        },
        id: 'WyJyZmlfZGF0YSIsNV0=',
        rowId: 5,
        rfiNumber: 'CCBC-030004-2',
      },
    },
  },
  {
    node: {
      rfiDataByRfiDataId: {
        jsonData: {
          rfiType: ['Missing files or information'],
          rfiDueBy: '2023-08-02',
          rfiAdditionalFiles: {
            detailedBudget: [
              {
                id: 23,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: '00784022-bb42-4ace-aae3-1a2eeb3d69e0',
              },
            ],
            detailedBudgetRfi: true,
            financialForecast: [
              {
                id: 24,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: '384e1b3b-62a0-4df3-a05c-fb73b58515b9',
              },
            ],
            lastMileIspOffering: [
              {
                id: 25,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: '191706d9-b5e2-49dc-b604-da89cf50a80b',
              },
            ],
            financialForecastRfi: true,
            geographicCoverageMap: [
              {
                id: 28,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: 'ee2358e8-169e-4f4a-b424-707f46cb7cc7',
              },
            ],
            lastMileIspOfferingRfi: true,
            geographicCoverageMapRfi: true,
            otherSupportingMaterials: [
              {
                id: 26,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: 'a1478e94-c82e-4adf-817d-ff052ab73f19',
              },
              {
                id: 27,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: 'b4c925c8-1f36-40c1-ae57-6dd49c60e5c9',
              },
            ],
            currentNetworkInfastructure: [
              {
                id: 30,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: '7873afcb-64f4-453c-b14e-421dd8b27939',
              },
              {
                id: 32,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: '10b84e50-01d2-40e3-9ac4-c4fc96e55b27',
              },
            ],
            otherSupportingMaterialsRfi: true,
            coverageAssessmentStatistics: [
              {
                id: 29,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: '8c269ff0-e5e3-42ae-a0c2-451b1dc8252d',
              },
            ],
            upgradedNetworkInfrastructure: [
              {
                id: 31,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: 'f1f4fffd-9ba4-40b2-8f62-1af336c6bff5',
              },
              {
                id: 33,
                name: 'file_1M.kmz',
                size: 1000000,
                type: '',
                uuid: 'dd9f38ed-afbd-446e-a9d5-45de1fd39161',
              },
            ],
            currentNetworkInfastructureRfi: true,
            coverageAssessmentStatisticsRfi: true,
            eligibilityAndImpactsCalculator: [
              {
                id: 22,
                name: 'test.xls',
                size: 0,
                type: 'application/vnd.ms-excel',
                uuid: '1bf829a4-ff89-4c62-a5f7-c3298945d562',
              },
            ],
            upgradedNetworkInfrastructureRfi: true,
            eligibilityAndImpactsCalculatorRfi: true,
          },
        },
        id: 'WyJyZmlfZGF0YSIsM10=',
        rowId: 3,
        rfiNumber: 'CCBC-030004-1',
      },
    },
  },
];

describe('The sortRfiFiles function', () => {
  it('handles an empty array', () => {
    expect(sortRfiFiles([])).toStrictEqual({});
  });

  it('returns the correct object', () => {
    expect(sortRfiFiles(mockRfiNodes)).toStrictEqual({
      geographicCoverageMap: {
        'CCBC-030004-2': [
          {
            id: 35,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '6c5328e2-2c64-4de1-921f-a289f57c1106',
          },
        ],
        'CCBC-030004-1': [
          {
            id: 28,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: 'ee2358e8-169e-4f4a-b424-707f46cb7cc7',
          },
        ],
      },
      eligibilityAndImpactsCalculator: {
        'CCBC-030004-2': [
          {
            id: 34,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '6287fd27-3994-4bf9-9a6b-2ad6d7b95abb',
          },
        ],
        'CCBC-030004-1': [
          {
            id: 22,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: '1bf829a4-ff89-4c62-a5f7-c3298945d562',
          },
        ],
      },
      detailedBudget: {
        'CCBC-030004-1': [
          {
            id: 23,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: '00784022-bb42-4ace-aae3-1a2eeb3d69e0',
          },
        ],
      },
      financialForecast: {
        'CCBC-030004-1': [
          {
            id: 24,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: '384e1b3b-62a0-4df3-a05c-fb73b58515b9',
          },
        ],
      },
      lastMileIspOffering: {
        'CCBC-030004-1': [
          {
            id: 25,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: '191706d9-b5e2-49dc-b604-da89cf50a80b',
          },
        ],
      },
      otherSupportingMaterials: {
        'CCBC-030004-1': [
          {
            id: 26,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: 'a1478e94-c82e-4adf-817d-ff052ab73f19',
          },
          {
            id: 27,
            name: 'test.xls',
            size: 0,
            type: 'application/vnd.ms-excel',
            uuid: 'b4c925c8-1f36-40c1-ae57-6dd49c60e5c9',
          },
        ],
      },
      currentNetworkInfastructure: {
        'CCBC-030004-1': [
          {
            id: 30,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '7873afcb-64f4-453c-b14e-421dd8b27939',
          },
          {
            id: 32,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '10b84e50-01d2-40e3-9ac4-c4fc96e55b27',
          },
        ],
      },
      coverageAssessmentStatistics: {
        'CCBC-030004-1': [
          {
            id: 29,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '8c269ff0-e5e3-42ae-a0c2-451b1dc8252d',
          },
        ],
      },
      upgradedNetworkInfrastructure: {
        'CCBC-030004-1': [
          {
            id: 31,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: 'f1f4fffd-9ba4-40b2-8f62-1af336c6bff5',
          },
          {
            id: 33,
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: 'dd9f38ed-afbd-446e-a9d5-45de1fd39161',
          },
        ],
      },
    });
  });
});
