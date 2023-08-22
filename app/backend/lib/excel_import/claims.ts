/* import * as XLSX from 'xlsx'; */
import { performQuery } from '../graphql';
/* import { convertExcelDateToJSDate } from '../sow_import/util'; */

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

const readSummary = async (wb, sheet_name, applicationId, claimsId) => {
  const ws = wb.Sheets[sheet_name];
  console.log('ws', ws !== undefined);

  // read excel data here

  const jsonData = {
    // excel fields here
  };

  const claimsData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: claimsId ? parseInt(claimsId, 10) : null,
  };

  return claimsData;
};

const LoadClaimsData = async (wb, sheet_name, req) => {
  const { applicationId, claimsId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet_name, applicationId, claimsId);

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
