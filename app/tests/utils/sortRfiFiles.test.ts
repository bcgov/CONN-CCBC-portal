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
          },
        },
        rowId: 5,
        rfiNumber: 'CCBC-030004-2',
        attachments: {
          nodes: [
            {
              id: 'WyJhdHRhY2htZW50cyIsMTJd',
              file: '6c5328e2-2c64-4de1-921f-a289f57c1106',
              fileName: 'file_1M.kmz',
              rowId: 12,
              createdAt: '2023-08-04T11:15:51.105183-07:00',
            },
          ],
        },
      },
    },
  },
];

describe('The sortRfiFiles function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles an empty array', () => {
    expect(sortRfiFiles([])).toStrictEqual({});
  });

  it('returns the correct object', () => {
    expect(sortRfiFiles(mockRfiNodes)).toStrictEqual({
      geographicCoverageMap: {
        'CCBC-030004-2': [
          {
            id: 'WyJhdHRhY2htZW50cyIsMTJd',
            name: 'file_1M.kmz',
            size: 1000000,
            type: '',
            uuid: '6c5328e2-2c64-4de1-921f-a289f57c1106',
            file: '6c5328e2-2c64-4de1-921f-a289f57c1106',
            fileName: 'file_1M.kmz',
            rowId: 12,
            createdAt: '2023-08-04T11:15:51.105183-07:00',
          },
        ],
      },
    });
  });
});
