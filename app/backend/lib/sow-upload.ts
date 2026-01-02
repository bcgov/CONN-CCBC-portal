import { Router } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import limiter from './excel_import/excel-limiter';
import getAuthRole from '../../utils/getAuthRole';
import LoadSummaryData from './sow_import/summary_tab';
import LoadTab1Data from './sow_import/tab_1';
import LoadTab2Data from './sow_import/tab_2';
import LoadTab7Data from './sow_import/tab_7';
import LoadTab8Data from './sow_import/tab_8';
import {
  ExpressMiddleware,
  commonFormidableConfig,
  parseForm,
} from './express-helper';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const sheetNames = ['Summary_Sommaire', '1', '2', '7', '8'];

const sowUpload = Router();

const processSow: ExpressMiddleware = async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'cbc_admin' ||
    authRole?.pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const errorList = [];
  const form = formidable(commonFormidableConfig);

  const files = await parseForm(form, req).catch((err) => {
    errorList.push({ level: 'file', error: err });
    return res.status(400).json(errorList).end();
  });

  const filename = Object.keys(files)[0];
  const uploadedFilesArray = files[filename] as Array<File>;

  const uploaded = uploadedFilesArray?.[0];
  if (!uploaded) {
    return res.status(200).end();
  }
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

  const validate = req.query?.validate === 'true';
  const result = await LoadSummaryData(wb, 'Summary_Sommaire', req);

  let exportError;
  if (result) {
    const loadError = (result as any).error;

    if (loadError) {
      errorList.push({ level: 'summary', error: loadError });
    }
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
    const tab7: any = await LoadTab7Data(sowId, wb, '7', req);
    const tab7Summary =
      tab7?.data?.createSowTab7?.sowTab7?.jsonData?.summaryTable;
    exportError = (tab7 as any)?.error;
    if (exportError) {
      errorList.push({ level: 'tab7', error: exportError });
    }
    const tab8 = await LoadTab8Data(sowId, wb, '8', req);
    exportError = (tab8 as any)?.error;
    if (exportError) {
      errorList.push({ level: 'tab8', error: exportError });
    }
    if (errorList.length > 0) {
      return res.status(400).json(errorList).end();
    }

    // If validate=true, return the validated data structure for comparison
    if (validate) {
      return res.status(200).json({
        validatedData: {
          summary: result,
          tab1,
          tab2,
          tab7,
          tab8,
        },
      }).end();
    }

    return res
      .status(200)
      .json({ result: { ...result, tab7Summary } })
      .end();
  }

  return res.status(400).json({ error: 'failed to save SoW data in DB' }).end();
};

sowUpload.post(
  '/api/analyst/sow/:applicationId/:ccbcNumber/:amendmentNumber',
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
