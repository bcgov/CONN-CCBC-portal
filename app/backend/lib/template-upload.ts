import { Router } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';
import limiter from './excel_import/excel-limiter';
import getAuthRole from '../../utils/getAuthRole';
import {
  ExpressMiddleware,
  commonFormidableConfig,
  parseForm,
} from './express-helper';
import readTemplateOneData from './excel_import/template_one';
import readTemplateTwoData from './excel_import/template_two';

// see https://docs.sheetjs.com/docs/getting-started/installation/nodejs/#installation
XLSX.set_fs(fs);

const templateUpload = Router();

const processTemplateUpload: ExpressMiddleware = async (req, res) => {
  const authRole = getAuthRole(req);
  const pgRole = authRole?.pgRole;
  const isRoleAuthorized =
    pgRole === 'ccbc_auth_user' ||
    pgRole === 'ccbc_admin' ||
    pgRole === 'ccbc_analyst' ||
    pgRole === 'super_admin';

  const templateNumber = Number(req.query?.templateNumber);

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

  // other validation stuff here

  if (errorList.length > 0) {
    return res.status(400).json(errorList).end();
  }

  let result = null;
  if (templateNumber === 1) {
    result = readTemplateOneData(wb);
  } else if (templateNumber === 2) {
    result = readTemplateTwoData(wb);
  } else {
    return res
      .status(400)
      .json({ error: `Template Number ${templateNumber} is not valid` })
      .end();
  }
  if (result) {
    return res.status(200).json({ result }).end();
  }

  return res
    .status(400)
    .json({ error: 'failed to process template upload' })
    .end();
};

// milestoneId is optional and used for the previously uploaded milestone so we can archive it if replacing with another excel upload.
templateUpload.post('/api/applicant/template', limiter, (req, res) => {
  // eslint-disable-next-line no-void
  void (() => processTemplateUpload(req, res, null))();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default templateUpload;
