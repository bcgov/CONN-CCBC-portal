import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createSomeMutation = `
  mutation tab2Mutation($input: CreateSowTab2Input!) {
    createSowTab2(
      input: 
      {
        sowTab2: $input
      }
    )
  }
`;

const readData = async(sow_id, wb, sheet_name) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], { header: "A" });
  for (let row = 1; row < sheet.length; row ++) {
    // place logic here
  }
  const result = [];

  return result;
}

const LoadTab2Data = async(sow_id, wb, sheet_name, req) => {
  const data = await readData(sow_id, wb, sheet_name);
   
  // time to persist in DB
  const result = await performQuery(createSomeMutation, {input: data}, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
   
}

export default LoadTab2Data;