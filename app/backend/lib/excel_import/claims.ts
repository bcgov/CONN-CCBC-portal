import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import { performQuery } from '../graphql';
import { convertExcelDateToJSDate } from '../sow_import/util';

const createClaimsMutation = `
  mutation claimsUploadMutation($input: CreateApplicationClaimsExcelDataInput!) {
    createApplicationClaimsExcelData(input:   $input) {
        applicationClaimsExcelData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheet_1, sheet_2, applicationId, claimsId) => {
  const claimsRequestFormSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_1], {
    header: 'A',
  });

  const progressReportSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_2], {
    header: 'A',
  });

  // Claims Request Form sheet fields
  const dateRequestReceived = claimsRequestFormSheet[0]['E'];
  const projectNumber = claimsRequestFormSheet[3]['D'];
  const claimNumber = claimsRequestFormSheet[14]['D'];
  const eligibleCostsIncurredFromDate = claimsRequestFormSheet[23]['C']
    ? convertExcelDateToJSDate(claimsRequestFormSheet[23]['C'])
    : null;
  const eligibleCostsIncurredToDate = claimsRequestFormSheet[24]['C']
    ? convertExcelDateToJSDate(claimsRequestFormSheet[24]['C'])
    : null;

  // Progress Report sheet fields
  const progressOnPermits = progressReportSheet[8]['G'];
  const hasConstructionBegun = progressReportSheet[10]['G'];
  const haveServicesBeenOffered = progressReportSheet[12]['G'];
  const projectScheduleRisks = progressReportSheet[14]['G'];
  const thirdPartyPassiveInfrastructure = progressReportSheet[15]['G'];
  const commincationMaterials = progressReportSheet[16]['G'];
  const projectBudgetRisks = progressReportSheet[18]['G'];
  const changesToOverallBudget = progressReportSheet[19]['G'];

  const jsonData = {
    dateRequestReceived,
    projectNumber,
    claimNumber,
    eligibleCostsIncurredFromDate,
    eligibleCostsIncurredToDate,
    progressOnPermits,
    hasConstructionBegun,
    haveServicesBeenOffered,
    projectScheduleRisks,
    thirdPartyPassiveInfrastructure,
    commincationMaterials,
    projectBudgetRisks,
    changesToOverallBudget,
  };

  const claimsData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: claimsId ? parseInt(claimsId, 10) : null,
  };

  return claimsData;
};

const ValidateData = async (data, req) => {
  const { ccbcNumber, applicationId } = req.params;

  const {
    claimNumber,
    dateRequestReceived,
    projectNumber,
    eligibleCostsIncurredFromDate,
    eligibleCostsIncurredToDate,
  } = data;

  // get all previous claims for this applications
  const claims: any = await performQuery(
    `
    query ClaimQuery {
      applicationByRowId(rowId: ${applicationId}) {
        applicationClaimsExcelDataByApplicationId(filter: {archivedAt: {isNull: true}}) {
          nodes {
            jsonData
          }
        }
      }
    }
    `,
    {},
    req
  ).catch((e) => {
    return { error: e };
  });

  // get an array of all previous used claim numebers
  const previousClaimNumbers =
    claims?.data?.applicationByRowId.applicationClaimsExcelDataByApplicationId?.nodes?.map(
      (claim) => {
        return claim.jsonData.claimNumber;
      }
    );

  const errors = [];

  if (claimNumber === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Claim number',
    });
  }

  if (previousClaimNumbers.includes(claimNumber)) {
    errors.push({
      level: 'claimNumber',
      error: `Check that it's the correct file and retry uploading. If you were trying to edit an existing claim, please click the edit button beside it.`,
    });
  }

  if (dateRequestReceived === undefined) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Date request received',
    });
  }

  if (
    eligibleCostsIncurredFromDate === undefined ||
    DateTime.fromISO(eligibleCostsIncurredFromDate).invalidReason
  ) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Eligible costs incurred from date',
    });
  }

  if (
    eligibleCostsIncurredToDate === undefined ||
    DateTime.fromISO(eligibleCostsIncurredToDate).invalidReason
  ) {
    errors.push({
      level: 'cell',
      error: 'Invalid data: Eligible costs incurred to date',
    });
  }

  if (
    eligibleCostsIncurredFromDate &&
    eligibleCostsIncurredToDate &&
    eligibleCostsIncurredFromDate > eligibleCostsIncurredToDate
  ) {
    errors.push({
      level: 'cell',
      error:
        'Invalid data: Eligible costs incurred from date cannot be greater than eligible costs incurred to date',
    });
  }

  if (
    projectNumber === undefined ||
    typeof projectNumber !== 'string' ||
    projectNumber !== ccbcNumber
  ) {
    const errorString = `CCBC Number mismatch: expected ${ccbcNumber}, received: ${projectNumber}`;
    if (!errors.find((err) => err.error === errorString))
      errors.push({
        error: `CCBC Number mismatch: expected ${ccbcNumber}, received: ${projectNumber}`,
      });
  }

  return errors;
};

const LoadClaimsData = async (wb, sheet_1, sheet_2, req) => {
  const { applicationId, claimsId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_1, sheet_2, applicationId, claimsId);

  const errorList = await ValidateData(data._jsonData, req);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createClaimsMutation,
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

export default LoadClaimsData;
