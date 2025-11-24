/**
 * @jest-environment node
 */
import * as XLSX from 'xlsx';
import request from 'supertest';
import * as graphqlBackend from '../../../backend/lib/graphql';
import LoadTab1Data, {
  hasDataInRow,
  readRowData,
  readData,
  TAB_ONE_CONSTANTS,
} from '../../../backend/lib/sow_import/tab_1';

jest.mock('../../../backend/lib/graphql');

const { COLUMN_KEYS } = TAB_ONE_CONSTANTS;

const buildMockTableData = () => {
  const rowData = {};
  const BOOLEAN_KEYS = [
    TAB_ONE_CONSTANTS.IS_DIRECT_TO_HOME_SATELITE,
    TAB_ONE_CONSTANTS.IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE,
    TAB_ONE_CONSTANTS.IS_INDIGENOUS_COMMUNITY_COLUMN,
    TAB_ONE_CONSTANTS.IS_WIRED,
    TAB_ONE_CONSTANTS.IS_WIRELESS,
  ];
  COLUMN_KEYS.forEach((key, index) => {
    if (BOOLEAN_KEYS.includes(key)) {
      rowData[key] = 'Yes';
    } else {
      rowData[key] = `Value_${index}`;
    }
  });
  return rowData;
};

describe('sow_tab_1 parsing tests', () => {
  it('the hasDataInRow function returns correctly', () => {
    const successObject = {};
    successObject[COLUMN_KEYS[0]] = 'Some Value';
    const failObject = {};
    const secondFailObject = {};
    secondFailObject[COLUMN_KEYS[0]] = undefined;

    const thirdFailObject = {};
    thirdFailObject[COLUMN_KEYS[0]] = '';

    expect(hasDataInRow(successObject)).toBeTrue();
    expect(hasDataInRow(failObject)).toBeFalse();
    expect(hasDataInRow(secondFailObject)).toBeFalse();
    expect(hasDataInRow(thirdFailObject)).toBeFalse();
  });

  it('the readRowData function returns only the relevant row data', () => {
    const rowData = buildMockTableData();

    const dataRead = readRowData(rowData);

    expect(dataRead.communityId).toBe(rowData[COLUMN_KEYS[0]]);
    expect(dataRead.provincesTerritories).toBe(rowData[COLUMN_KEYS[1]]);
    expect(dataRead.communityName).toBe(rowData[COLUMN_KEYS[2]]);
    expect(dataRead.latitude).toBe(rowData[COLUMN_KEYS[3]]);
    expect(dataRead.longitude).toBe(rowData[COLUMN_KEYS[4]]);
    expect(dataRead.isIndigenousCommunity).toBeTrue();
    expect(dataRead.householdsImpactedIndigenous).toBe(rowData[COLUMN_KEYS[6]]);
    expect(dataRead.numberOfHouseholds).toBe(rowData[COLUMN_KEYS[7]]);
    expect(dataRead.isWired).toBeTrue();
    expect(dataRead.isWireless).toBeTrue();
    expect(dataRead.isImpactedByMobileWirelessService).toBeTrue();
  });

  it('readData reads a worksheet', () => {
    const {
      TOTAL_HOUSEHOLDS_IMPACTED_ROW,
      INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW,
      TOTAL_COMMUNITIES_IMPACTED_ROW,
      TOTALS_COLUMN,
      COMMUNITY_ID_HEADING,
      COMMUNITIES_ID_COLUMN,
    } = TAB_ONE_CONSTANTS;
    const worksheetArray = Array(100).fill({});
    const GAP_AFTER_SUMMARY_ROWS = TOTAL_COMMUNITIES_IMPACTED_ROW + 10;
    worksheetArray[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 1,
    };
    worksheetArray[TOTAL_COMMUNITIES_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 2,
    };
    worksheetArray[TOTAL_HOUSEHOLDS_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 3,
    };
    // trigger the table found condition
    worksheetArray[GAP_AFTER_SUMMARY_ROWS] = {
      [COMMUNITIES_ID_COLUMN]: COMMUNITY_ID_HEADING,
    };

    worksheetArray[GAP_AFTER_SUMMARY_ROWS + 1] = buildMockTableData();

    const readDataResult = readData(1, worksheetArray);

    expect(readDataResult.householdsImpactedIndigenous).toBe(1);
    expect(readDataResult.totalNumberCommunitiesImpacted).toBe(2);
    expect(readDataResult.numberOfHouseholds).toBe(3);
    expect(readDataResult.communityData.length).toBe(1);
  });

  it('should call mutation with proper input', async () => {
    const {
      TOTAL_HOUSEHOLDS_IMPACTED_ROW,
      INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW,
      TOTAL_COMMUNITIES_IMPACTED_ROW,
      TOTALS_COLUMN,
      COMMUNITY_ID_HEADING,
      COMMUNITIES_ID_COLUMN,
    } = TAB_ONE_CONSTANTS;
    const worksheetArray = Array(100).fill({});
    const GAP_AFTER_SUMMARY_ROWS = TOTAL_COMMUNITIES_IMPACTED_ROW + 10;
    worksheetArray[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 1,
    };
    worksheetArray[TOTAL_COMMUNITIES_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 2,
    };
    worksheetArray[TOTAL_HOUSEHOLDS_IMPACTED_ROW] = {
      [TOTALS_COLUMN]: 3,
    };
    // trigger the table found condition
    worksheetArray[GAP_AFTER_SUMMARY_ROWS] = {
      [COMMUNITIES_ID_COLUMN]: COMMUNITY_ID_HEADING,
    };

    worksheetArray[GAP_AFTER_SUMMARY_ROWS + 1] = buildMockTableData();
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockImplementation(() => {
      return worksheetArray;
    });

    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['1'],
    });

    jest.spyOn(graphqlBackend, 'performQuery').mockImplementation(async () => {
      return {};
    });

    const expectedInput = {
      input: {
        jsonData: {
          communityData: [
            {
              communityId: 'Value_0',
              communityName: 'Value_2',
              householdsImpactedIndigenous: 'Value_6',
              isDirectToHomeSatelite: true,
              isImpactedByMobileWirelessService: true,
              isIndigenousCommunity: true,
              isWired: true,
              isWireless: true,
              latitude: 'Value_3',
              longitude: 'Value_4',
              numberOfHouseholds: 'Value_7',
              provincesTerritories: 'Value_1',
            },
          ],
          householdsImpactedIndigenous: 1,
          numberOfHouseholds: 3,
          totalNumberCommunitiesImpacted: 2,
        },
        sowId: 1,
      },
    };

    await LoadTab1Data(1, { Sheets: {} } as XLSX.WorkBook, '1', request);

    expect(graphqlBackend.performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expectedInput,
      expect.anything()
    );
  });

  it('readData return expected validation errors', async () => {
    const {
      TOTAL_HOUSEHOLDS_IMPACTED_ROW,
      INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW,
      TOTAL_COMMUNITIES_IMPACTED_ROW,
      TOTALS_COLUMN,
      COMMUNITY_ID_HEADING,
      COMMUNITIES_ID_COLUMN,
    } = TAB_ONE_CONSTANTS;
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockImplementation(() => {
      const worksheetArray = Array(100).fill({});
      const GAP_AFTER_SUMMARY_ROWS = TOTAL_COMMUNITIES_IMPACTED_ROW + 10;
      worksheetArray[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW] = {
        [TOTALS_COLUMN]: 'oops',
      };
      worksheetArray[TOTAL_COMMUNITIES_IMPACTED_ROW] = {
        [TOTALS_COLUMN]: 'oops',
      };
      worksheetArray[TOTAL_HOUSEHOLDS_IMPACTED_ROW] = {
        [TOTALS_COLUMN]: 'oops',
      };
      // trigger the table found condition
      worksheetArray[GAP_AFTER_SUMMARY_ROWS] = {
        [COMMUNITIES_ID_COLUMN]: COMMUNITY_ID_HEADING,
      };

      return worksheetArray;
    });

    const wb = XLSX.read(null);
    const data = await LoadTab1Data(1, wb, '1', request);
    const expected = {
      error: [
        {
          level: 'cell',
          cell: '14H',
          error: 'Invalid data: Indigenous Households Impacted',
          received: 'oops',
          expected: 'number',
        },
        {
          level: 'cell',
          cell: '15H',
          error: 'Invalid data: Total Number of Households Impacted',
          received: 'oops',
          expected: 'number',
        },
        {
          level: 'cell',
          cell: '16H',
          error: 'Invalid data: Total Number of Communities Impacted',
          received: 'oops',
          expected: 'number',
        },
        {
          level: 'table',
          cell: 'Community Table',
          error: 'Invalid data: No completed Community Information rows found',
          received: '0 completed rows',
          expected: 'at least 1 completed row',
        },
      ],
    };
    expect(data).toEqual(expected);
  });
});
