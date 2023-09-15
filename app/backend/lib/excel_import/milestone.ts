import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import { convertExcelDateToJSDate } from '../sow_import/util';

const createMilestoneMutation = `
  mutation milestoneUploadMutation($input: CreateApplicationMilestoneExcelDataInput!) {
    createApplicationMilestoneExcelData(input: $input) {
        applicationMilestoneExcelData {
        id
        rowId
        jsonData
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheets, applicationId, milestoneId) => {
  const projectUpdatesCentreSheet = XLSX.utils.sheet_to_json(
    wb.Sheets[sheets[0]],
    {
      header: 'A',
    }
  );

  const milestone1Sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheets[1]], {
    header: 'A',
  });

  const milestone2Sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheets[2]], {
    header: 'A',
  });

  const jsonData = {
    projectNumber: projectUpdatesCentreSheet[3]['C'],
    milestone1Progress: projectUpdatesCentreSheet[4]['G'],
    milestone2Progress: projectUpdatesCentreSheet[5]['G'],
    milestone3Progress: projectUpdatesCentreSheet[6]['G'],
    overallMilestoneProgress: projectUpdatesCentreSheet[7]['G'],
    milestone1DateOfReception: milestone1Sheet[15]['C']
      ? convertExcelDateToJSDate(milestone1Sheet[15]['C'])
      : '',
    milestone2DateOfReception: milestone2Sheet[5]['D']
      ? convertExcelDateToJSDate(milestone2Sheet[5]['D'])
      : '',
  };

  const milestoneData = {
    _applicationId: parseInt(applicationId, 10),
    _jsonData: jsonData,
    _oldId: milestoneId ? parseInt(milestoneId, 10) : null,
  };

  return milestoneData;
};

const ValidateData = async (data, req) => {
  const { ccbcNumber } = req.params;

  const { projectNumber } = data;

  const errors = [];
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

const LoadMilestoneData = async (wb, sheets, req) => {
  const { applicationId, milestoneId } = req.params;
  const validate = req.query?.validate === 'true';

  const data = await readSummary(wb, sheets, applicationId, milestoneId);

  const errorList = await ValidateData(data._jsonData, req);

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
        _oldId: data._oldId || null,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });
  return result;
};

export default LoadMilestoneData;
