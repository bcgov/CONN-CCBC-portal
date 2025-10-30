import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import {
  convertExcelDropdownToBoolean,
  convertExcelDateToJSDate,
} from './util';

const createSomeMutation = `
  mutation tab2Mutation($input: SowTab2Input!) {
    createSowTab2(input: {sowTab2: $input}) {
      clientMutationId
    }
  }
`;

const readData = async (wb, sheet_name) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });
  const result = [];
  let tableDetected = false;
  for (let row = 1; row < sheet.length; row++) {
    let validLine = false;
    const suspect = sheet[row]['A'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
    }
    // if (typeof(value) !== 'string') continue;
    if (value.indexOf('Entry Number') > -1) {
      tableDetected = true;
      continue;
    }
    if (tableDetected) {
      validLine = sheet[row]['O'] && typeof sheet[row]['O'] === 'string';
      value = sheet[row]['O'];
      // now reading line
      if (validLine && value === 'Complete') {
        const lineData = {
          entryNumber: sheet[row]['A'],
          projectSiteName: sheet[row]['B'],
          projectSiteIdentifier: sheet[row]['C'],
          projectSiteType: sheet[row]['D'],
          latitude: sheet[row]['E'],
          longitude: sheet[row]['F'],
          newOrExisting: sheet[row]['G'],
          isSitePop: convertExcelDropdownToBoolean(sheet[row]['H']),
          isSiteGateway: convertExcelDropdownToBoolean(sheet[row]['I']),
          landAccessType: sheet[row]['J'],
          description: sheet[row]['K'],
          milestone1: convertExcelDateToJSDate(sheet[row]['L']),
          milestone2: convertExcelDateToJSDate(sheet[row]['M']),
          milestone3: convertExcelDateToJSDate(sheet[row]['N']),
        };
        result.push(lineData);
      }
    }
  }
  return result;
};

const ValidateData = (data) => {
  const errors = [];
  if (data.length === 0) {
    errors.push({
      cell: null,
      error: 'Invalid data: No completed Project Site rows found',
      received: `${data.length} completed`,
      expected: 'at least 1 completed row',
    });
  }
  return errors;
};
const LoadTab2Data = async (sow_id, wb, sheet_name, req) => {
  const validate = req.query?.validate === 'true';
  const data = await readData(wb, sheet_name);

  const errorList = ValidateData(data);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  if (validate) {
    return data;
  }

  // time to persist in DB
  const input = { input: { sowId: parseInt(sow_id, 10), jsonData: data } };
  const result = await performQuery(createSomeMutation, input, req).catch(
    (e) => {
      return { error: [{ level: 'database', error: e }] };
    }
  );

  return result;
};

export default LoadTab2Data;
