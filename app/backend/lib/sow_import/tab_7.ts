import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';


const createDetailedBudgetMutation = `
  mutation DetailedBudgetMutation($input: CreateSowDetailedBudgetInput!) {
    createSowDetailedBudget(
      input: {sowDetailedBudget: $input
    )
  }
`;

const readBudget = async(sow_id, wb, sheet_name) => {
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], { header: "A" });
  const result = [];

  let tableDetected=false;

  for (let row = 1; row < budget.length; row ++) 
  {
      let validLine = false;
      const suspect = budget[row]['B'];
      let value;
      if (suspect === undefined) continue;
      if (typeof(suspect) !== 'string') { 
        value = suspect.toString();
      }
      else {
        value = suspect;
      }
      // if (typeof(value) !== 'string') continue;
      if (value.indexOf('Direct Labour')>-1) {
          tableDetected=true;
          continue;
      } 
      if (value.indexOf('Direct Equipment')>-1) {
        tableDetected=false;
        continue;
      } 
      if (tableDetected) { 
          validLine = budget[row]['K'] && typeof(budget[row]['K']) === 'number';
          validLine = validLine && budget[row]['H'] && typeof(budget[row]['H']) === 'number';
          validLine = validLine && budget[row]['J'] && typeof(budget[row]['J']) === 'number';
          validLine = validLine && budget[row]['I'] && typeof(budget[row]['I']) === 'number';
          if (value === 'Subtotal') validLine=false;

          // now reading line
          if (validLine) {
            const detailedBudget = 
            { 
              sowId: sow_id, 
              directLabourCosts: value, 
              additionalComments: budget[row]['F'], 
              descriptionOfLabour: budget[row]['D'], 
              ruralBroadband: budget[row]['H'],
              totalAmount: budget[row]['K'], 
              mobile: budget[row]['J'],
              veryRemoteBroadband: budget[row]['I']
            }  
            result.push(detailedBudget);
          }
      }
  }
  return result;
}

const LoadTab7Data = async(sow_id, wb, sheet_name, req) => {
  const data = await readBudget(sow_id, wb, sheet_name);
   
  // time to persist in DB
  const result = await performQuery(createDetailedBudgetMutation, {input: data}, req)
  .catch((e) => {
    return { error: e };
  });

  return result; 
}

export default LoadTab7Data;