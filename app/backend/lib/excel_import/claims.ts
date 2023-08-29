import * as XLSX from 'xlsx';
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
  const projectNumber = claimsRequestFormSheet[3]['C'];
  const claimNumber = claimsRequestFormSheet[14]['C'];
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

const LoadClaimsData = async (wb, sheet_1, sheet_2, req) => {
  const { applicationId, claimsId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_1, sheet_2, applicationId, claimsId);

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
