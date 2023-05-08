import { Router } from 'express';
import config from '../../config';
import formidable from 'formidable';
import fs from 'fs'; 
import RateLimit from 'express-rate-limit'; 
import * as XLSX from 'xlsx';
import { performQuery } from './graphql';
import getAuthRole from '../../utils/getAuthRole'; 

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');
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

const createDetailedBudgetMutation = `
  mutation DetailedBudgetMutation($input: CreateSowDetailedBudgetInput!) {
    createSowDetailedBudget(
      input: {sowDetailedBudget: $input
    )
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

const readBudget = async(sow_id, budget) => {
  const result = [];

  let table_detected=false;

  for (var row = 1; row < budget.length; row ++) 
  {
      let valid_line = false;
      let suspect = budget[row]['B'];
      let value;
      if (suspect == undefined) continue;
      if (typeof(suspect) !== 'string') { 
        value = suspect.toString();
      }
      else {
        value = suspect;
      }
      // if (typeof(value) !== 'string') continue;
      if (value.indexOf('Direct Labour')>-1) {
          table_detected=true;
          continue;
      } 
      if (value.indexOf('Direct Equipment')>-1) {
        table_detected=false;
        continue;
      } 
      if (table_detected) { 
          valid_line = budget[row]['K'] && typeof(budget[row]['K']) === 'number';
          valid_line = valid_line && budget[row]['H'] && typeof(budget[row]['H']) === 'number';
          valid_line = valid_line && budget[row]['J'] && typeof(budget[row]['J']) === 'number';
          valid_line = valid_line && budget[row]['I'] && typeof(budget[row]['I']) === 'number';
          if (value === 'Subtotal') valid_line=false;

          // now reading line
          if (valid_line) {
            let detailedBudget = 
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
            // console.log(`saved row ${JSON.stringify(detailedBudget)}`);     
          }
          else {
            console.log(`skipped ${JSON.stringify(budget[row])}`); 
          }
      }
  }
  return result;
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
    // check header
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== AWS_S3_SECRET_KEY) {
      return res.status(404).end();
    }
    req.claims = {
      identity_provider: 'idir',
      client_roles: ['admin'],
      aud: 'ccbc',
      exp: 0,
      iat: 0,
      iss: 'ccbc',
      sub: 'ccbc',
    };
  }
  // if (!isRoleAuthorized) {
  //   return res.status(404).end();
  // } 
  // const form = new formidable.IncomingForm({maxFileSize:8000000});

  // const files = await parseForm(form, req).catch((err) => { 
  //   return res.status(400).json({ error: err }).end();
  // });

  // const filename = Object.keys(files)[0];
  // const uploaded = files[filename]; 

  // const file = fs.readFileSync(uploaded.filepath, 'utf8');
  // const data = JSON.parse(file); 
  const filepath = __dirname + '/UBF_SoW2.xlsx';
  if (fs.existsSync(filepath) === false) {
    return res.status(400).json({error: `failed to find file ${filepath}`}).end();
  }
  const buf = fs.readFileSync(filepath);
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

  // const sowData = (result as any)?.data?.applicationSowData;

  if (result) {
    const sowData = (result as any)?.data?.createApplicationSowData?.applicationSowData;
    const sowId = sowData?.rowId || 1;

    const detailedData = await readBudget(sowId, budget);
    const rowResults = [];
    
    for (var row = 0; row < detailedData.length; row ++) {
      const rowData = detailedData[row];
      console.log(rowData);
      const done = await performQuery(createDetailedBudgetMutation, {input: {sowDetailedBudget: rowData}}, req)
        .catch((e) => {
          return res.status(400).json({ error: e }).end();
        });
      rowResults.push(done);
    }
    return res.status(200).json({result, rowResults}).end();
  }
  // if (result) {
  //   return res.status(200).json(result).end();
  // } 
  
  return res.status(400).json({error: 'failed to save SoW data in DB'}).end();
});

// export const config = {
//   api: {
//     bodyParser: false,
//     externalResolver: true,
//   },
// };

export default sowUpload;
