import { Router } from 'express';
import formidable from 'formidable';
import fs from 'fs'; 
import RateLimit from 'express-rate-limit'; 
import * as XLSX from 'xlsx'; 
import getAuthRole from '../../utils/getAuthRole'; 
import LoadSummaryData from './sow_import/summary_tab';
import LoadTab1Data from './sow_import/tab_1';
import LoadTab2Data from './sow_import/tab_2'
import LoadTab7Data from './sow_import/tab_7';
import LoadTab8Data from './sow_import/tab_8';
import { ExpressMiddleware, parseForm } from './express-helper';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const sheetNames = ['Summary_Sommaire','1','2','3','4','5','6','7','8'];

const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

const sowUpload = Router();

const processSow: ExpressMiddleware = async (req, res) => { 
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  } 

  const form = new formidable.IncomingForm({maxFileSize:8000000});

  const files = await parseForm(form, req).catch((err) => { 
    return res.status(400).json({ error: err }).end();
  });

  const filename = Object.keys(files)[0];
  const uploaded = files[filename]; 

  const buf = fs.readFileSync(uploaded.filepath);
  const wb = XLSX.read(buf); 

  // check if we have all needed worksheets
  let missingSheet = '';
  sheetNames.forEach(x=>{
      if(wb.SheetNames.indexOf(x) === -1) {
        missingSheet = x; 
      } 
  });
  if (missingSheet.length > 0) {
    return res.status(400).json({ error: `missing required sheet ${missingSheet}. Found ${JSON.stringify(wb.SheetNames)}`}).end();
  }
  const result = await LoadSummaryData(wb, req);

  let exportError;
  if (result) {
    const sowData = (result as any)?.data?.createApplicationSowData?.applicationSowData;
    const sowId = sowData?.rowId || 1;

    const tab2 = await LoadTab2Data(sowId, wb, '2', req);
    exportError = (tab2 as any)?.error;
    if (exportError) {
      return res.status(400).json({ error: exportError }).end();
    }
    await LoadTab1Data(sowId, wb, '1', req);
    await LoadTab7Data(sowId, wb, '7', req);
    await LoadTab8Data(sowId, wb, '8', req);
    return res.status(200).json({result}).end();
  }
  
  return res.status(400).json({error: 'failed to save SoW data in DB'}).end();
}

sowUpload.post('/api/analyst/sow', limiter, (req, res) => {
  // eslint-disable-next-line no-void
  void (() => processSow(req,res,null))();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default sowUpload;