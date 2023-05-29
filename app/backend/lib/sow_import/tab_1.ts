import XLSX, { WorkBook } from 'xlsx';
import { performQuery } from '../graphql';
import convertExcelDropdownToBoolean from './util';

const createSomeMutation = `
  mutation someMutation($input: someInput!) {
    createSomeTable(
      input: {someData: $input
    )
  }
`;

const HOUSEHOLDS_IMPACT_COLUMN = 'H';
const INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW = 13;
const TOTAL_HOUSEHOLDS_IMPACTED_ROW = 14;
const TOTAL_COMMUNITIES_IMPACTED_ROW = 15;

const COMMUNITIES_ID_COLUMN = 'A';
const COMMUNITY_ID_HEADING = 'Community ID';
const PROVINCE_COLUMN = 'B';
const COMMUNITY_NAME_COLUMN = 'C';
const LATITUDE_COLUMN = 'D';
const LONGITUDE_COLUMN = 'E';
const IS_INDIGENOUS_COMMUNITY_COLUMN = 'F';
const INDIGENOUS_HOUSEHOLDS_IMPACTED_COLUMN = 'G';
// essentially a repeat of line 12, not sure how to name this for the table
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
  HOUSEHOLDS_IMPACT_COLUMN,
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

export const readData = async (
  sow_id: number,
  wb: WorkBook,
  sheet_name: string
) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });
  // The values for the total numbers are static, and don't have to be
  // dynamically found
  const indigenousHouseholdsImpacted =
    sheet[INDIGENOUS_HOUSEHOLDS_IMPACTED_ROW][HOUSEHOLDS_IMPACT_COLUMN];
  const totalNumberHouseholdsImpacted =
    sheet[TOTAL_HOUSEHOLDS_IMPACTED_ROW][HOUSEHOLDS_IMPACT_COLUMN];
  const totalNumberCommunitiesImpacted =
    sheet[TOTAL_COMMUNITIES_IMPACTED_ROW][HOUSEHOLDS_IMPACT_COLUMN];
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

const LoadTab1Data = async (sow_id, wb, sheet_name, req) => {
  const data = await readData(sow_id, wb, sheet_name);

  // time to persist in DB
  const result = await performQuery(
    createSomeMutation,
    { input: data },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadTab1Data;
