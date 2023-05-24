import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const sheetNames = ['Summary_Sommaire','1','2','3','4','5','6','7','8'];

const createSowMutation = `
  mutation sowUploadMutation($input: ApplicationSowDataInput!) {
    createApplicationSowData(input: {applicationSowData:  $input}) {
        applicationSowData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const ExcelDateToJSDate = (date) => {
  return new Date(Math.round((date - 25569)*86400*1000)).toISOString();
}

const readSummary = async(wb) => {
  const summary = XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]], { header: "A" });
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[8]], { header: "A" });
  
  const sowData = {
      applicationId: 10, 
      jsonData: {
        effectiveStartDate: "", 
        projectCompletionDate: "", 
        projectStartDate: "", 
        totalEligibleCost: 0, 
        totalIneligibleCost: 0, 
        totalProjectCost: 0
      }
  }; 
  for (let row = 1; row < summary.length; row ++) 
  { 
      const value = summary[row]['C'];
      if (value === undefined) continue;
      if (typeof(value) !== 'string') continue;
      const input = summary[row]['D'];
      if (input === undefined) continue; 
      if (typeof(input) !== 'number') continue;
      const realDate = ExcelDateToJSDate(input);
      if (value.indexOf('Effective Start Date') > -1) {
          sowData.jsonData.effectiveStartDate = realDate;
      }
      if (value.indexOf('Project Start Date') > -1) {
          sowData.jsonData.projectStartDate = realDate;
      }
      if (value.indexOf('Project Completion Date') > -1) {
          sowData.jsonData.projectCompletionDate = realDate;
      }
      
  }
  for (let row = 1; row < budget.length; row ++) 
  { 
      const value = budget[row]['G'];
      if (value === undefined) continue;
      if (typeof(value) !== 'string') continue;
      const input = budget[row]['H'];
      if (input === undefined) continue; 

      if (value.indexOf('Total Eligible') > -1) {
          sowData.jsonData.totalEligibleCost = input || 0;
      }
      if (value.indexOf('Total Ineligible') > -1) {
          sowData.jsonData.totalIneligibleCost = input || 0;
      }
      if (value.indexOf('Total Project') > -1) {
          sowData.jsonData.totalProjectCost = input || 0;
      }
  }
  return sowData;
}
const LoadSummaryData = async(wb, req) => {
  const data = await readSummary(wb);
   
  // time to persist in DB
  const result = await performQuery(createSowMutation, {input: data}, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
}

export default LoadSummaryData;