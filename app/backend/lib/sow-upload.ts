import { Router } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import RateLimit from 'express-rate-limit';
import * as XLSX from 'xlsx';
import getAuthRole from '../../utils/getAuthRole';
import LoadSummaryData from './sow_import/summary_tab';
import LoadTab1Data from './sow_import/tab_1';
import LoadTab2Data from './sow_import/tab_2';
import LoadTab7Data from './sow_import/tab_7';
import LoadTab8Data from './sow_import/tab_8';
import { ExpressMiddleware, parseForm } from './express-helper';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const sheetNames = ['Summary_Sommaire', '1', '2', '7', '8'];

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
});

const sowUpload = Router();

const processSow: ExpressMiddleware = async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const errorList = [];
  const form = new formidable.IncomingForm({ maxFileSize: 8000000 });

  const files = await parseForm(form, req).catch((err) => {
    errorList.push({ level: 'file', error: err });
    return res.status(400).json(errorList).end();
  });

  const filename = Object.keys(files)[0];
  const uploaded = files[filename];

  const buf = fs.readFileSync(uploaded.filepath);
  const wb = XLSX.read(buf);

  // check if we have all needed worksheets
  sheetNames.forEach((sheet) => {
    if (wb.SheetNames.indexOf(sheet) === -1) {
      errorList.push({
        level: 'workbook',
        error: `missing required sheet "${sheet}". Found: ${JSON.stringify(
          wb.SheetNames
        )}`,
      });
    }
  });

  if (errorList.length > 0) {
    return res.status(400).json(errorList).end();
  }

  const result = await LoadSummaryData(wb, 'Summary_Sommaire', req);

  let exportError;
  if (result) {
    const loadError = (result as any).error;
    if (loadError) {
      errorList.push({ level: 'summary', error: loadError });
    } else {
      const sowData = (result as any)?.data?.createApplicationSowData
        ?.applicationSowData;
      const sowId = sowData?.rowId || 1;

      const tab2 = await LoadTab2Data(sowId, wb, '2', req);
      exportError = (tab2 as any)?.error;
      if (exportError) {
        errorList.push({ level: 'tab2', error: exportError });
      }
      const tab1 = await LoadTab1Data(sowId, wb, '1', req);
      exportError = (tab1 as any)?.error;
      if (exportError) {
        errorList.push({ level: 'tab1', error: exportError });
      }
      // await LoadTab7Data(sowId, wb, '7', req);
      const tab7 = await LoadTab7Data(sowId, wb, '7', req);
      exportError = (tab7 as any)?.error;
      if (exportError) {
        errorList.push({ level: 'tab8', error: exportError });
      }
      const tab8 = await LoadTab8Data(sowId, wb, '8', req);
      exportError = (tab8 as any)?.error;
      if (exportError) {
        errorList.push({ level: 'tab8', error: exportError });
      }
    }
    if (errorList.length > 0) {
      return res.status(400).json(errorList).end();
    }

    return res.status(200).json({ result }).end();
  }

  return res.status(400).json({ error: 'failed to save SoW data in DB' }).end();
};

sowUpload.post(
  '/api/analyst/sow/:applicationId/:ccbcNumber',
  limiter,
  (req, res) => {
    // eslint-disable-next-line no-void
    void (() => processSow(req, res, null))();
  }
);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default sowUpload;
