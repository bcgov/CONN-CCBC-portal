import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createSowMutation = `
  mutation communityReportUploadMutation($input: CreateApplicationCommunityReportExcelDataInput!) {
    createApplicationCommunityReportExcelData(input:   $input) {
        applicationCommunityReportExcelData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

// For the summary table
const TOTALS_COLUMN = 'G';
const COMMUNITIES_IN_PLANNING_ROW = 27;
const COMMUNITIES_IN_CONSTRUCTION_ROW = 28;
const COMMUNITIES_OPERATIONAL_ROW = 29;
const OVERAL_PROJECT_STAGE_ROW = 30;
const TOTAL_NUMBER_OF_COMMUNITIES_ROW = 31;

// For the community detail table
const COMMUNITY_NAME_COLUMN = 'B';
const COMMUNITY_NAME_HEADING = 'Community Name';
const COMMUNITY_ID_COLUMN = 'C';
const PROVINCE_COLUMN = 'D';
const LATITUDE_COLUMN = 'E';
const LONGITUDE_COLUMN = 'F';
const TYPE_OF_SERVICE_COLUMN = 'G';
const STAGE_COLUMN = 'H';
const ACTUAL_CONSTRUCTION_START_DATE_COLUMN = 'I';
const ACTUAL_CONSTRUCTION_END_DATE_COLUMN = 'J';
const APPLICATION_NUMBER_COLUMN = 'K';
const INFORMATION_COMPLETE_COLUMN = 'L';

const COLUMN_KEYS = [
  COMMUNITY_NAME_COLUMN,
  COMMUNITY_ID_COLUMN,
  PROVINCE_COLUMN,
  LATITUDE_COLUMN,
  LONGITUDE_COLUMN,
  TYPE_OF_SERVICE_COLUMN,
  STAGE_COLUMN,
  ACTUAL_CONSTRUCTION_START_DATE_COLUMN,
  ACTUAL_CONSTRUCTION_END_DATE_COLUMN,
  APPLICATION_NUMBER_COLUMN,
  INFORMATION_COMPLETE_COLUMN,
];

export const hasDataInRow = (row: Object) =>
  COLUMN_KEYS.some(
    (columnKey) => row[columnKey] !== '' && row[columnKey] !== undefined
  );

export const readRowData = (row: Object) => {
  return {
    communityName: row[COMMUNITY_NAME_COLUMN],
    communityId: row[COMMUNITY_ID_COLUMN],
    provincesTerritories: row[PROVINCE_COLUMN],
    latitude: row[LATITUDE_COLUMN],
    longitude: row[LONGITUDE_COLUMN],
    typeOfService: row[TYPE_OF_SERVICE_COLUMN],
    stage: row[STAGE_COLUMN],
    actualConstructionStartDate: row[ACTUAL_CONSTRUCTION_START_DATE_COLUMN],
    actualConstructionEndDate: row[ACTUAL_CONSTRUCTION_END_DATE_COLUMN],
    applicationNumber: row[APPLICATION_NUMBER_COLUMN],
    informationComplete: row[INFORMATION_COMPLETE_COLUMN],
  };
};

const readSummary = async (wb, sheet_name, applicationId) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  let isTableFound = false;
  const result = [];
  for (let rowNum = 1; rowNum < sheet.length; rowNum++) {
    if (
      sheet[rowNum][COMMUNITY_NAME_COLUMN] === COMMUNITY_NAME_HEADING &&
      !isTableFound
    ) {
      isTableFound = true;
    } else if (isTableFound && hasDataInRow(sheet[rowNum])) {
      result.push(readRowData(sheet[rowNum]));
    }
  }

  const jsonData = {
    numberOfCommunitiesInPlanning:
      sheet[COMMUNITIES_IN_PLANNING_ROW][TOTALS_COLUMN],
    numberOfCommunitiesInConstruction:
      sheet[COMMUNITIES_IN_CONSTRUCTION_ROW][TOTALS_COLUMN],
    numberOfCommunitiesOperational:
      sheet[COMMUNITIES_OPERATIONAL_ROW][TOTALS_COLUMN],
    overallProjectStage: sheet[OVERAL_PROJECT_STAGE_ROW][TOTALS_COLUMN],
    totalNumberOfCommunities:
      sheet[TOTAL_NUMBER_OF_COMMUNITIES_ROW][TOTALS_COLUMN],
    communityData: result,
  };

  const communityReportData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
  };

  return communityReportData;
};

const ValidateData = (data) => {
  const errors = [];
  if (data.numberOfCommunitiesInPlanning === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Number of Communities in Planning',
    });
  }
  if (data.numberOfCommunitiesInConstruction === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Number of Communities in Construction',
    });
  }
  if (data.numberOfCommunitiesOperational === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Number of Communities Operational',
    });
  }
  if (data.overallProjectStage === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Overall Project Stage',
    });
  }
  if (data.totalNumberOfCommunities === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Total Number of Communities',
    });
  }

  return errors;
};

const LoadCommunityReportData = async (wb, sheet_name, req) => {
  const { applicationId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_name, applicationId);

  const errorList = ValidateData(data._jsonData);

  if (errorList.length > 0) {
    return { error: errorList };
  }
  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createSowMutation,
    {
      input: {
        _applicationId: data._applicationId,
        _jsonData: data._jsonData,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadCommunityReportData;
