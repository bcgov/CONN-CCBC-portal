import XLSX from 'xlsx';
import { performQuery } from '../graphql';
import { convertExcelDropdownToBoolean } from './util';

const createTab1Mutation = `
  mutation tab1Mutation($input: SowTab1Input!) {
    createSowTab1(input: { sowTab1: $input }) {
      sowTab1 {
        id
      }
    }
  }
`;

// For the summary table
const TOTALS_COLUMN = 'H';
const INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW = 13;
const TOTAL_HOUSEHOLDS_IMPACTED_ROW = 14;
const TOTAL_COMMUNITIES_IMPACTED_ROW = 15;

// For the community detail table
const COMMUNITIES_ID_COLUMN = 'A';
const COMMUNITY_ID_HEADING = 'Community ID';
const PROVINCE_COLUMN = 'B';
const COMMUNITY_NAME_COLUMN = 'C';
const LATITUDE_COLUMN = 'D';
const LONGITUDE_COLUMN = 'E';
const IS_INDIGENOUS_COMMUNITY_COLUMN = 'F';
const INDIGENOUS_HOUSEHOLDS_IMPACTED_COLUMN = 'G';
const TOTAL_HOUSEHOLDS_IMPACTED_COLUMN = 'H';
const IS_WIRED = 'I';
const IS_WIRELESS = 'J';
const IS_DIRECT_TO_HOME_SATELITE = 'K';
const IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE = 'L';

const COLUMN_KEYS = [
  COMMUNITIES_ID_COLUMN,
  PROVINCE_COLUMN,
  COMMUNITY_NAME_COLUMN,
  LATITUDE_COLUMN,
  LONGITUDE_COLUMN,
  IS_INDIGENOUS_COMMUNITY_COLUMN,
  INDIGENOUS_HOUSEHOLDS_IMPACTED_COLUMN,
  TOTAL_HOUSEHOLDS_IMPACTED_COLUMN,
  IS_WIRED,
  IS_WIRELESS,
  IS_DIRECT_TO_HOME_SATELITE,
  IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE,
];

export const TAB_ONE_CONSTANTS = {
  COLUMN_KEYS,
  COMMUNITIES_ID_COLUMN,
  PROVINCE_COLUMN,
  COMMUNITY_NAME_COLUMN,
  LATITUDE_COLUMN,
  LONGITUDE_COLUMN,
  IS_INDIGENOUS_COMMUNITY_COLUMN,
  INDIGENOUS_HOUSEHOLDS_IMPACTED_COLUMN,
  TOTAL_HOUSEHOLDS_IMPACTED_COLUMN,
  IS_WIRED,
  IS_WIRELESS,
  IS_DIRECT_TO_HOME_SATELITE,
  IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE,
  COMMUNITY_ID_HEADING,
  TOTALS_COLUMN,
  INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW,
  TOTAL_HOUSEHOLDS_IMPACTED_ROW,
  TOTAL_COMMUNITIES_IMPACTED_ROW,
};

export const hasDataInRow = (row: Object) =>
  COLUMN_KEYS.some(
    (columnKey) => row[columnKey] !== '' && row[columnKey] !== undefined
  );

export const readRowData = (row: Object) => {
  return {
    communityId: row[COMMUNITIES_ID_COLUMN],
    provincesTerritories: row[PROVINCE_COLUMN],
    communityName: row[COMMUNITY_NAME_COLUMN],
    latitude: row[LATITUDE_COLUMN],
    longitude: row[LONGITUDE_COLUMN],
    isIndigenousCommunity: convertExcelDropdownToBoolean(
      row[IS_INDIGENOUS_COMMUNITY_COLUMN]
    ),
    householdsImpactedIndigenous: row[INDIGENOUS_HOUSEHOLDS_IMPACTED_COLUMN],
    numberOfHouseholds: row[TOTAL_HOUSEHOLDS_IMPACTED_COLUMN],
    isWired: convertExcelDropdownToBoolean(row[IS_WIRED]),
    isWireless: convertExcelDropdownToBoolean(row[IS_WIRELESS]),
    isDirectToHomeSatelite: convertExcelDropdownToBoolean(
      row[IS_DIRECT_TO_HOME_SATELITE]
    ),
    isImpactedByMobileWirelessService: convertExcelDropdownToBoolean(
      row[IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE]
    ),
  };
};

export const readData = (sow_id: number, sheet: any) => {
  // The values for the total numbers are static, and don't have to be
  // dynamically found
  const indigenousHouseholdsImpacted =
    sheet[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW][TOTALS_COLUMN];
  const totalNumberHouseholdsImpacted =
    sheet[TOTAL_HOUSEHOLDS_IMPACTED_ROW][TOTALS_COLUMN];
  const totalNumberCommunitiesImpacted =
    sheet[TOTAL_COMMUNITIES_IMPACTED_ROW][TOTALS_COLUMN];
  let isTableFound = false;
  const result = [];
  for (let rowNum = 1; rowNum < sheet.length; rowNum++) {
    if (
      sheet[rowNum][COMMUNITIES_ID_COLUMN] === COMMUNITY_ID_HEADING &&
      !isTableFound
    ) {
      isTableFound = true;
    } else if (isTableFound && hasDataInRow(sheet[rowNum])) {
      result.push(readRowData(sheet[rowNum]));
    }
  }

  return {
    householdsImpactedIndigenous: indigenousHouseholdsImpacted,
    numberOfHouseholds: totalNumberHouseholdsImpacted,
    totalNumberCommunitiesImpacted,
    communityData: result,
  };
};

const ValidateData = (data, sheet) => {
  const getRowNumberFromSheet = (index: number) => {
    const rowData: any = sheet[index];
    const rowNumber = rowData?.__rowNum__;
    if (typeof rowNumber === 'number') {
      return rowNumber + 1;
    }
    return index + 1;
  };
  const errors = [];
  if (typeof data.householdsImpactedIndigenous !== 'number') {
    errors.push({
      level: 'cell',
      cell: `${getRowNumberFromSheet(INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW)}${TOTALS_COLUMN}`,
      error: 'Invalid data: Indigenous Households Impacted',
      received: sheet[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW][TOTALS_COLUMN],
      expected: 'number',
    });
  }
  if (typeof data.numberOfHouseholds !== 'number') {
    errors.push({
      level: 'cell',
      cell: `${getRowNumberFromSheet(TOTAL_HOUSEHOLDS_IMPACTED_ROW)}${TOTALS_COLUMN}`,
      error: 'Invalid data: Total Number of Households Impacted',
      received: sheet[TOTAL_HOUSEHOLDS_IMPACTED_ROW][TOTALS_COLUMN],
      expected: 'number',
    });
  }
  if (typeof data.totalNumberCommunitiesImpacted !== 'number') {
    errors.push({
      level: 'cell',
      cell: `${getRowNumberFromSheet(TOTAL_COMMUNITIES_IMPACTED_ROW)}${TOTALS_COLUMN}`,
      error: 'Invalid data: Total Number of Communities Impacted',
      received: sheet[TOTAL_COMMUNITIES_IMPACTED_ROW][TOTALS_COLUMN],
      expected: 'number',
    });
  }
  if (data.communityData.length === 0) {
    errors.push({
      level: 'table',
      cell: 'Community Table',
      error: 'Invalid data: No completed Community Information rows found',
      received: `${data.communityData.length} completed rows`,
      expected: 'at least 1 completed row',
    });
  }
  return errors;
};
const LoadTab1Data = async (sow_id, wb, sheet_name, req) => {
  const validate = req.query?.validate === 'true';
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });
  const data = readData(sow_id, sheet);
  const input = { input: { sowId: parseInt(sow_id, 10), jsonData: data } };
  const errorList = ValidateData(data, sheet);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }

  // time to persist in DB
  const result = await performQuery(createTab1Mutation, input, req).catch(
    (e) => {
      return { error: [{ level: 'database', error: e }] };
    }
  );

  return result;
};

export default LoadTab1Data;
