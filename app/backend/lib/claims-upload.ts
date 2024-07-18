import { Router } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import limiter from './excel_import/excel-limiter';
import getAuthRole from '../../utils/getAuthRole';
import LoadClaimsData from './excel_import/claims';
import {
  ExpressMiddleware,
  commonFormidableConfig,
  parseForm,
} from './express-helper';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const sheetNames = ['Claim Request Form', 'Progress Report'];

const claimsUpload = Router();

const processClaims: ExpressMiddleware = async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
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

  // other validation stuff here

  if (errorList.length > 0) {
    return res.status(400).json(errorList).end();
  }

  const result = await LoadClaimsData(wb, sheetNames[0], sheetNames[1], req);
  // get around typescript complaining
  if (result['error']) {
    return res.status(400).json(result['error']).end();
  }

  if (result) {
    return res.status(200).json({ result }).end();
  }

  return res
    .status(400)
    .json({ error: 'failed to save claims data in DB' })
    .end();
};

// claimsId is optional and used for the previously uploaded claim so we can archive it if replacing with another excel upload.
claimsUpload.post(
  '/api/analyst/claims/:applicationId/:ccbcNumber/:claimsId/:excelDataId',
  limiter,
  (req, res) => {
    // eslint-disable-next-line no-void
    void (() => processClaims(req, res, null))();
  }
);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default claimsUpload;
