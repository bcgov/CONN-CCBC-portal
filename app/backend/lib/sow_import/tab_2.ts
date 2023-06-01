import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createSomeMutation = `
  mutation tab2Mutation($input: SowTab2Input!) {
    createSowTab2(input: {sowTab2: $input}) {
      clientMutationId
    }
  }
`;

const readData = async(wb, sheet_name) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], { header: "A" });
  const result = [];
  let tableDetected = false;
  for (let row = 1; row < sheet.length; row ++) {
    let validLine = false;
      const suspect = sheet[row]['A'];
      let value;
      if (suspect === undefined) continue;
      if (typeof(suspect) !== 'string') { 
        value = suspect.toString();
      }
      else {
        value = suspect;
      }
      // if (typeof(value) !== 'string') continue;
      if (value.indexOf('Entry Number')>-1) {
          tableDetected=true;
          continue;
      }  
      if (tableDetected) { 
          validLine = sheet[row]['O'] && typeof(sheet[row]['O']) === 'string'; 
          value = sheet[row]['O'];
          // now reading line
          if (validLine && (value === 'Complete')) {
            const lineData = 
            {  
              entryNumber: sheet[row]['A'], 
              projectSiteName: sheet[row]['B'], 
              projectSiteIdentifier: sheet[row]['C'], 
              projectSiteType: sheet[row]['D'], 
              latitude: sheet[row]['E'], 
              longitude: sheet[row]['F'], 
              newOrExisting: sheet[row]['G'], 
              isSitePop: sheet[row]['H'], 
              isSiteGateway: sheet[row]['I'], 
              landAccessType: sheet[row]['J'], 
              description: sheet[row]['K'], 
              milestone1: sheet[row]['L'], 
              milestone2: sheet[row]['M'], 
              milestone3: sheet[row]['N']
            }  
            result.push(lineData);
          }
      }
  }
  return result;
}

const LoadTab2Data = async(sow_id, wb, sheet_name, req) => {
  const { validate = false } = req.query;
  const data = await readData(wb, sheet_name);
  
  if (data.length === 0) {
    return { error: 'no data found for Tab 2'};
  }
  if (validate) {
    return data;
  }
  // time to persist in DB
  const input = {input: {sowId: sow_id, jsonData: data}};
  const result = await performQuery(createSomeMutation, input, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
}

export default LoadTab2Data;