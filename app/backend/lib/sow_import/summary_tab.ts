import * as XLSX from 'xlsx';
import { performQuery } from '../graphql'; 

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
  if (typeof(date) !== 'number') return null;
  return new Date(Math.round((date - 25569)*86400*1000)).toISOString();
}

const readSummary = async(wb, sheet_name) => {
  const summary = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], { header: "A" });
  
  const sowData = {
      applicationId: 10, 
      jsonData: {
        applicantName: "",
        projectTitle: "",
        province: "",
        applicationNumber: "",
        effectiveStartDate: "", 
        projectStartDate: "", 
        projectCompletionDate: "", 
        backboneFibre: "", 
        backboneMicrowave: "", 
        backboneSatellite: "", 
        lastMileFibre: "", 
        lastMileCable: "",
        lastMileDSL: "",
        lastMileMobileWireless: "",
        lastMileFixedWireless: "",
        lastMileSatellite: ""
      }
  }; 
  // hardcoded summary table position: rows from 6 to 20
  // first pass - columns C and D
  for (let row = 6; row < 20; row ++) 
  { 
    const value = summary[row]['C'];
    if (value === undefined) continue;
    if (typeof(value) !== 'string') continue;
    const input = summary[row]['D'];
    if (input === undefined) continue; 
    
    if (value.indexOf('Applicant Name') > -1) { 
      sowData.jsonData.applicantName = input; 
    }
    if (value.indexOf('Project Title') > -1) { 
      sowData.jsonData.projectTitle = input; 
    }
    if (value.indexOf('Province') > -1) { 
      sowData.jsonData.province = input; 
    }
    if (value.indexOf('Application Number') > -1) { 
      sowData.jsonData.applicationNumber = input; 
    }
    if (value.indexOf('Effective Start Date') > -1) {
      sowData.jsonData.effectiveStartDate = ExcelDateToJSDate(input);
    }
    if (value.indexOf('Project Start Date') > -1) {
        sowData.jsonData.projectStartDate = ExcelDateToJSDate(input);
    }
    if (value.indexOf('Project Completion Date') > -1) {
        sowData.jsonData.projectCompletionDate =ExcelDateToJSDate(input);
    }   
  }

  // second pass - columns F and G
  let backbone = false;
  let lastMile = false;
  for (let row = 6; row < 20; row ++) 
  { 
    const value = summary[row]['F'];
    if (value === undefined) continue;
    if (typeof(value) !== 'string') continue;
    if (value.indexOf('Backbone Technologies') > -1) {
      backbone = true;
    }
    if (value.indexOf('Last Mile Technologies') > -1) {
      backbone = false;
      lastMile = true;
    }
    const input = summary[row]['G'];
    if (input === undefined) continue;  
    if (backbone && value.indexOf('Fibre') > -1) { 
      sowData.jsonData.backboneFibre = input; 
    }
    if (backbone && value.indexOf('Microwave') > -1) { 
      sowData.jsonData.backboneMicrowave = input; 
    }
    if (backbone && value.indexOf('Satellite') > -1) { 
      sowData.jsonData.backboneSatellite = input; 
    }
    if (lastMile && value.indexOf('Fibre') > -1) { 
      sowData.jsonData.lastMileFibre = input; 
    }
    if (lastMile && value.indexOf('Cable') > -1) { 
      sowData.jsonData.lastMileCable = input; 
    }
    if (lastMile && value.indexOf('DSL') > -1) { 
      sowData.jsonData.lastMileDSL = input; 
    }
    if (lastMile && value.indexOf('Mobile') > -1) { 
      sowData.jsonData.lastMileMobileWireless = input; 
    }
    if (lastMile && value.indexOf('Fixed') > -1) { 
      sowData.jsonData.lastMileFixedWireless = input; 
    }
    if (lastMile && value.indexOf('Satellite') > -1) { 
      sowData.jsonData.lastMileSatellite = input; 
    } 
  }

  return sowData;
}
const LoadSummaryData = async(wb, sheet_name, req) => {
  const data = await readSummary(wb, sheet_name);
   
  // time to persist in DB
  const result = await performQuery(createSowMutation, {input: data}, req)
  .catch((e) => {
    return { error: e };
  });

  return result;
}

export default LoadSummaryData;