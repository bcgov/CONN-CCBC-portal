// import * as XLSX from 'xlsx';
// import { DateTime } from 'luxon';
import { performQuery } from '../graphql';
/* import { convertExcelDateToJSDate } from '../sow_import/util'; */

const createMilestoneMutation = `
  mutation milestoneUploadMutation($input: CreateApplicationMilestoneExcelDataInput!) {
    createApplicationMilestoneExcelData(input: $input) {
        applicationMilestoneExcelData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheet, applicationId, milestoneId) => {
  // const milestoneFormSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
  //   header: 'A',
  // });

  const jsonData = {};

  const milestoneData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: milestoneId ? parseInt(milestoneId, 10) : null,
  };

  return milestoneData;
};

const ValidateData = async () => {
  // const ValidateData = async (data, req) => {
  //   const { ccbcNumber } = req.params;
  //
  //   const { milestoneNumber } = data;
  //
  const errors = [];
  //
  //   if (milestoneNumber === undefined) {
  //     errors.push({
  //       level: 'cell',
  //       error: 'Invalid data: Claim number',
  //     });
  //   }
  //
  return errors;
};

const LoadMilestoneData = async (wb, sheet, req) => {
  const { applicationId, milestoneId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheet, applicationId, milestoneId);

  /*   const errorList = await ValidateData(data._jsonData, req); */
  const errorList = await ValidateData();

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createMilestoneMutation,
    {
      input: {
        _applicationId: data._applicationId,
        _jsonData: data._jsonData,
        _oldId: data._oldId,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });
  return result;
};

export default LoadMilestoneData;
