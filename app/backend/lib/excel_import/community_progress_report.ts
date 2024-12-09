import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import { convertExcelDateToJSDate } from '../sow_import/util';

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

const getCcbcNumber = `
query getCcbcNumber($_rowId: Int!) {
  applicationByRowId(rowId: $_rowId) {
    ccbcNumber
  }
}
`;

// For the summary table
const TOTALS_COLUMN = 'G';
let COMMUNITIES_IN_PLANNING_ROW = 25;
let COMMUNITIES_IN_CONSTRUCTION_ROW = 27;
let COMMUNITIES_OPERATIONAL_ROW = 28;
let OVERALL_PROJECT_STAGE_ROW = 29;
let TOTAL_NUMBER_OF_COMMUNITIES_ROW = 30;
const COMMUNITIES_IN_PLANNING_TEXT = 'Number of Communities in Planning';

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
    actualConstructionStartDate: convertExcelDateToJSDate(
      row[ACTUAL_CONSTRUCTION_START_DATE_COLUMN]
    ),
    actualConstructionEndDate: convertExcelDateToJSDate(
      row[ACTUAL_CONSTRUCTION_END_DATE_COLUMN]
    ),
    applicationNumber: row[APPLICATION_NUMBER_COLUMN],
    informationComplete: row[INFORMATION_COMPLETE_COLUMN],
  };
};

const readSummary = async (wb, sheet_name, applicationId, reportId) => {
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

  // find number of communities in planning
  for (
    let row = COMMUNITIES_IN_PLANNING_ROW - 5;
    row <= COMMUNITIES_IN_PLANNING_ROW + 5;
    row++
  ) {
    const cellValue = sheet[row]['C'];
    console.log('row', row, 'cellValue', cellValue);
    if (cellValue === COMMUNITIES_IN_PLANNING_TEXT) {
      COMMUNITIES_IN_PLANNING_ROW = row;
      COMMUNITIES_IN_CONSTRUCTION_ROW = row + 1;
      COMMUNITIES_OPERATIONAL_ROW = row + 2;
      OVERALL_PROJECT_STAGE_ROW = row + 3;
      TOTAL_NUMBER_OF_COMMUNITIES_ROW = row + 4;
      break;
    }
  }

  const jsonData = {
    numberOfCommunitiesInPlanning:
      sheet[COMMUNITIES_IN_PLANNING_ROW][TOTALS_COLUMN],
    numberOfCommunitiesInConstruction:
      sheet[COMMUNITIES_IN_CONSTRUCTION_ROW][TOTALS_COLUMN],
    numberOfCommunitiesOperational:
      sheet[COMMUNITIES_OPERATIONAL_ROW][TOTALS_COLUMN],
    overallProjectStage: sheet[OVERALL_PROJECT_STAGE_ROW][TOTALS_COLUMN],
    totalNumberOfCommunities:
      sheet[TOTAL_NUMBER_OF_COMMUNITIES_ROW][TOTALS_COLUMN],
    communityData: result,
  };

  const communityReportData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: reportId ? parseInt(reportId, 10) : null,
  };

  return communityReportData;
};

const ValidateData = async (data, applicationRowId, req) => {
  const queryResult = await performQuery(
    getCcbcNumber,
    { _rowId: parseInt(applicationRowId, 10) },
    req
  );
  const ccbcNumber = queryResult?.data?.applicationByRowId?.ccbcNumber;
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

  data.communityData.forEach((comData) => {
    if (
      comData.communityName !== undefined &&
      typeof comData.communityName !== 'string'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Community Name ${comData.communityName}`,
      });
    }
    if (
      comData.communityId !== undefined &&
      typeof comData.communityId !== 'number'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Community ID ${comData.communityId}`,
      });
    }

    if (
      comData.provincesTerritories !== undefined &&
      typeof comData.provincesTerritories !== 'string'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Provinces/Territory ${comData.provincesTerritories}`,
      });
    }

    if (
      comData.latitude !== undefined &&
      typeof comData.latitude !== 'number'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Latitude ${comData.latitude}`,
      });
    }

    if (
      comData.longitude !== undefined &&
      typeof comData.longitude !== 'number'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Latitude ${comData.longitude}`,
      });
    }

    if (
      comData.typeOfService !== undefined &&
      typeof comData.typeOfService !== 'string'
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Type of Service ${comData.typeOfService}`,
      });
    }

    if (comData.stage !== undefined && typeof comData.stage !== 'string') {
      errors.push({
        level: 'cell',
        error: `Invalid data: Stage ${comData.stage}`,
      });
    }

    if (
      (comData.actualConstructionStartDate === undefined ||
        typeof comData.actualConstructionStartDate !== 'string') &&
      comData.actualConstructionStartDate !== null
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Actual Construction Start Date ${comData.actualConstructionStartDate}`,
      });
    }

    if (
      (comData.actualConstructionEndDate === undefined ||
        typeof comData.actualConstructionEndDate !== 'string') &&
      comData.actualConstructionEndDate !== null
    ) {
      errors.push({
        level: 'cell',
        error: `Invalid data: Actual Construction Start Date ${comData.actualConstructionEndDate}`,
      });
    }

    if (
      comData.applicationNumber === undefined ||
      typeof comData.applicationNumber !== 'string' ||
      comData.applicationNumber !== ccbcNumber
    ) {
      const errorString = `CCBC Number mismatch: expected ${ccbcNumber}, received: ${comData.applicationNumber}`;
      if (!errors.find((err) => err.error === errorString))
        errors.push({
          error: `CCBC Number mismatch: expected ${ccbcNumber}, received: ${comData.applicationNumber}`,
        });
    }
  });

  return errors;
};

const LoadCommunityReportData = async (wb, sheet_name, req) => {
  const { applicationId, reportId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_name, applicationId, reportId);
  console.log('data', data);
  const errorList = await ValidateData(data._jsonData, applicationId, req);

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
