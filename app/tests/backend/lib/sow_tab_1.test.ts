/**
 * @jest-environment node
 */
import * as XLSX from 'xlsx';
import {
  hasDataInRow,
  readRowData,
  readData,
  TAB_ONE_CONSTANTS,
} from '../../../backend/lib/sow_import/tab_1';

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
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockImplementation(() => {
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
      return worksheetArray;
    });

    const readDataResult = readData(1, { Sheets: {} } as XLSX.WorkBook, '1');

    expect(readDataResult.householdsImpactedIndigenous).toBe(1);
    expect(readDataResult.totalNumberCommunitiesImpacted).toBe(2);
    expect(readDataResult.numberOfHouseholds).toBe(3);
    expect(readDataResult.communityData.length).toBe(1);
  });
});
