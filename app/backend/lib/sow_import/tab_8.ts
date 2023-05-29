import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createSomeMutation = `
  mutation someMutation($input: someInput!) {
    createSomeTable(
      input: {someData: $input
    )
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
  for (let row = 18; row < sheet.length; row ++) {
    const suspect = sheet[row]['A'];
    let value;
    if (suspect === undefined) continue;
    if (typeof(suspect) === 'string' && tableDetected === false) { 
      value = suspect.toString();
      if (value === 'Project Zone') { 
        tableDetected = true;
        continue;
      }
    }
    if (typeof(suspect) === 'number' && tableDetected === true) { 
      const completed = sheet[row]['M'];
      if (typeof(suspect) === 'string' && completed =='Complete') {
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

  return result;
}

const LoadTab8Data = async(sow_id, wb, sheet_name, req) => {
  const data = await readData(sow_id, wb, sheet_name);
  console.log(data); 
  if (data?.errors?.length > 0) {
    return { error: data.errors };
  }
  if (data.geoNames.length === 0) {
    return { error: 'no data found for Tab 8'};
  }
  // time to persist in DB
  const result = await performQuery(createSomeMutation, {input: data}, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
}

export default LoadTab8Data;