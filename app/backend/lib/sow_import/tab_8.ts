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


const readData = async(sow_id, wb, sheet_name) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], { header: "A" });
  const result = {
    communitiesNumber: 0,
    indigenousCommunitiesNumber: 0,
    geoNames: [],
    errors: []
  }
  if (sheet.length< 20) {
    result.errors.push('Wrong number of rows on Tab 8');
    return result;
  }
  for (let row = 1; row < 18; row ++) {
    const suspect = sheet[row]['B'];
    let value;
    if (suspect === undefined) continue;
    if (typeof(suspect) !== 'string') { 
      value = suspect.toString();
    }
    else {
      value = suspect;
      if (value.indexOf('Number of Communities')>-1) {
        const number= sheet[row]['E'];
        if (typeof(number) !== 'number') {
          result.errors.push('Wrong value for Number of Communities Impacted on Tab 8');
        }
        result.communitiesNumber = number;
      }
      
      if (value.indexOf('Number of Indigenous')>-1) {
        const number= sheet[row]['E'];
        if (typeof(number) !== 'number') {
          result.errors.push('Wrong value for Number of Indigenous Communities Impacted on Tab 8');
        }
        result.indigenousCommunitiesNumber = number;
      }
    }
  }

  let tableDetected = false;
  for (let row = 10; row < sheet.length; row ++) {
    const suspect = sheet[row]['A']; 
    let value;
    if (suspect === undefined) continue; 
    if (typeof(suspect) === 'string' && tableDetected === false) { 
      value = suspect.toString();
      if (value.indexOf('Project Zone') === 0) { 
        tableDetected = true; 
        continue;
      }
    }
    if (typeof(suspect) === 'number' && tableDetected === true) { 
      const completed = sheet[row]['M'];
      if (typeof(completed) === 'string' && completed.indexOf('Complete') === 0) {
        const lineData = {
          projectZone: sheet[row]['A'],
          geoNameId: sheet[row]['B'],
          bcGeoName: sheet[row]['C'],
          geoType: sheet[row]['D'],
          latitude: sheet[row]['E'], 
          longitude: sheet[row]['F'], 
          impacted: sheet[row]['H'], 
          mapLink: sheet[row]['J'], 
          indigenous: sheet[row]['K']
        }
        result.geoNames.push(lineData);
      }
    }
  }
  if (result.errors.length === 0) delete result.errors;
  return result;
}

const LoadTab8Data = async(sow_id, wb, sheet_name, req) => {
  const { validate = false } = req.query;
  const data = await readData(sow_id, wb, sheet_name);
  
  if (validate) {
    return data;
  }

  // still need to handle errors
  if (data?.errors?.length > 0) {
    return { error: data.errors };
  }
  if (data.geoNames.length === 0) {
    return { error: 'no data found for Tab 8'};
  }
  
  // time to persist in DB
  const input = {input: {sowId: sow_id, jsonData: data}};
  const result = await performQuery(createTab8Mutation, input, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
}

export default LoadTab8Data;