import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createTab8Mutation = `
  mutation tab8Mutation($input: SowTab8Input!) {
    createSowTab8(input: { sowTab8: $input }) {
      sowTab8 {
        id
      }
    }
  }
`;

const readData = async (sow_id, wb, sheet_name) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  const getRowNumber = (rowData, fallbackIndex) => {
    if (rowData && typeof rowData.__rowNum__ === 'number') {
      return rowData.__rowNum__ + 1;
    }
    return fallbackIndex + 1;
  };

  const result = {
    communitiesNumber: 0,
    indigenousCommunitiesNumber: 0,
    geoNames: [],
    errors: [],
  };
  if (sheet.length < 20) {
    result.errors.push({
      level: 'table',
      cell: null,
      error: 'Wrong number of rows on Tab 8',
      received: `${sheet.length} rows`,
      expected: 'at least 20 rows',
    });
    return result;
  }
  for (let row = 1; row < 18; row++) {
    const rowData = sheet[row];
    const suspect = rowData['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
      if (value.indexOf('Number of Communities') > -1) {
        const number = rowData['E'];
        const cell = `E${getRowNumber(rowData, row)}`;
        if (typeof number !== 'number') {
          result.errors.push({
            level: 'cell',
            error: 'Invalid data: Number of Communities Impacted',
            cell,
            received: number ?? 'null',
            expected: 'number',
          });
        } else {
          result.communitiesNumber = number;
        }
      }

      if (value.indexOf('Number of Indigenous') > -1) {
        const number = rowData['E'];
        const cell = `E${getRowNumber(rowData, row)}`;
        if (typeof number !== 'number') {
          result.errors.push({
            level: 'cell',
            error: 'Invalid data: Number of Indigenous Communities Impacted',
            cell,
            received: number ?? 'null',
            expected: 'number',
          });
        } else {
          result.indigenousCommunitiesNumber = number;
        }
      }
    }
  }

  let tableDetected = false;
  for (let row = 10; row < sheet.length; row++) {
    const suspect = sheet[row]['A'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect === 'string' && tableDetected === false) {
      value = suspect.toString();
      if (value.indexOf('Project Zone') === 0) {
        tableDetected = true;
        continue;
      }
    }
    if (typeof suspect === 'number' && tableDetected === true) {
      const completed = sheet[row]['M'];
      if (
        typeof completed === 'string' &&
        completed.indexOf('Complete') === 0
      ) {
        const lineData = {
          projectZone: sheet[row]['A'],
          geoNameId: sheet[row]['B'],
          bcGeoName: sheet[row]['C'],
          geoType: sheet[row]['D'],
          latitude: sheet[row]['E'],
          longitude: sheet[row]['F'],
          impacted: sheet[row]['H'],
          mapLink: sheet[row]['J'],
          indigenous: sheet[row]['K'],
        };
        result.geoNames.push(lineData);
      }
    }
  }
  if (result.geoNames.length === 0) {
    result.errors.push({
      level: 'table',
      error: 'Invalid data: No completed Geographic Names rows found',
      cell: 'Geographic Names table',
      received: `${result.geoNames.length} completed rows`,
      expected: 'at least 1 completed row',
    });
  }
  if (result.errors.length === 0) delete result.errors;
  return result;
};

const LoadTab8Data = async (sow_id, wb, sheet_name, req) => {
  const validate = req.query?.validate === 'true';
  const data = await readData(sow_id, wb, sheet_name);

  if (data?.errors?.length > 0) {
    return { error: data.errors };
  }

  if (validate) {
    return data;
  }

  // time to persist in DB
  const input = { input: { sowId: parseInt(sow_id, 10), jsonData: data } };
  const result = await performQuery(createTab8Mutation, input, req).catch(
    (e) => {
      return { error: [{ level: 'database', error: e }] };
    }
  );

  return result;
};

export default LoadTab8Data;
