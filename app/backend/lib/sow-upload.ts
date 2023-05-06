import { Router } from 'express';
import formidable from 'formidable';
import fs from 'fs'; 
import RateLimit from 'express-rate-limit'; 
import * as XLSX from 'xlsx';
import { performQuery } from './graphql';
import getAuthRole from '../../utils/getAuthRole';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const sheet_names = ['Summary_Sommaire','1','2','3','4','5','6','7','8'];

const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

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

const sowUpload = Router();

const ExcelDateToJSDate = (date) => {
  return new Date(Math.round((date - 25569)*86400*1000)).toISOString();
}

const readSummary = async(summary, budget) => {
  const sowData = {
      applicationId: 10, 
      effectiveStartDate: "", 
      projectCompletionDate: "", 
      projectStartDate: "", 
      totalEligibleCost: 0, 
      totalIneligibleCost: 0, 
      totalProjectCost: 0
  }; 
  for (var row = 1; row < summary.length; row ++) 
  { 
      let value = summary[row]['C'];
      if (value === undefined) continue;
      if (typeof(value) !== 'string') continue;
      let input = summary[row]['D'];
      if (input === undefined) continue; 
      if (typeof(input) !== 'number') continue;
      const realDate = ExcelDateToJSDate(input);
      if (value.indexOf('Effective Start Date') > -1) {
          sowData.effectiveStartDate = realDate;
      }
      if (value.indexOf('Project Start Date') > -1) {
          sowData.projectStartDate = realDate;
      }
      if (value.indexOf('Project Completion Date') > -1) {
          sowData.projectCompletionDate = realDate;
      }
      
  }
  for (var row = 1; row < budget.length; row ++) 
  { 
      let value = budget[row]['G'];
      if (value === undefined) continue;
      if (typeof(value) !== 'string') continue;
      let input = budget[row]['H'];
      if (input === undefined) continue; 
      // if (typeof(input) !== 'number') continue;

      if (value.indexOf('Total Eligible') > -1) {
          sowData.totalEligibleCost = input || 0;
      }
      if (value.indexOf('Total Ineligible') > -1) {
          sowData.totalIneligibleCost = input || 0;
      }
      if (value.indexOf('Total Project') > -1) {
          sowData.totalProjectCost = input || 0;
      }
  }
  return sowData;
}

const parseForm = (form, req) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => { 
      if (err) { 
        return reject(err);
      } 
      return resolve(files);
    });
  });
}

// eslint-disable-next-line consistent-return
sowUpload.post('/api/analyst/sow', limiter, async (req, res) => { 
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  } 
  // const form = new formidable.IncomingForm({maxFileSize:8000000});

  // const files = await parseForm(form, req).catch((err) => { 
  //   return res.status(400).json({ error: err }).end();
  // });

  // const filename = Object.keys(files)[0];
  // const uploaded = files[filename]; 

  // const file = fs.readFileSync(uploaded.filepath, 'utf8');
  // const data = JSON.parse(file); 
  
  const buf = fs.readFileSync('UBF_SoW2.xlsx');
  const wb = XLSX.read(buf); 

  /*
  steps:
  - read SoW summary-level data and insert into `application_sow_data` table
  - read each worksheet and insert into correspondent table
  */
    
  // check if we have all needed worksheets
  sheet_names.forEach(x=>{
      if(wb.SheetNames.indexOf(x)==-1) throw new Error('missing required sheet');
  });

  // - read SoW summary-level data and insert into `application_sow_data` table
  const main = XLSX.utils.sheet_to_json(wb.Sheets[sheet_names[0]], { header: "A" });
  const budget = XLSX.utils.sheet_to_json(wb.Sheets[sheet_names[8]], { header: "A" });
  const data = await readSummary(main, budget);
   
  // time to persist in DB
  const result = await performQuery(createSowMutation, {input: data}, req)
  .catch((e) => {
    return res.status(400).json({ error: e }).end();
  });

  const sowData = (result as any)?.data?.applicationSowData;

  if (sowData) {
    return res.status(200).json(sowData).end();
  } 
  
  return res.status(400).json({error: 'failed to save SoW data in DB'}).end();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default sowUpload;
