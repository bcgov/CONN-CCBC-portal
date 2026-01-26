import { Router } from 'express';
import formidable, { File } from 'formidable';
import Ajv, { ErrorObject } from 'ajv';
import fs from 'fs';
import RateLimit from 'express-rate-limit';
import jsonSourceMap from 'json-source-map';
import schema from './gis-schema.json';
import { performQuery } from './graphql';
import getAuthRole from '../../utils/getAuthRole';
import { commonFormidableConfig, parseForm } from './express-helper';
import { jsonProcessor } from './json-lint';
import { reportServerError } from './emails/errorNotification';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});

const saveGisDataMutation = `
  mutation gisUploadMutation($input: JSON, $fileName: String) {
    createGisData(input: {gisData: {jsonData:$input, fileName:$fileName}}) {
      gisData {
        id,
        rowId
      },
      clientMutationId
    }
  }
`;

const gisUpload = Router();
const ajv = new Ajv({ allErrors: true, removeAdditional: true });

const MIN_PATH_DEPTH = 2; // instancePath: JSON Pointer to the location in the data instance. For array we need 2.
const LINE_NUMBER_POSITION = 1; // instancePath for array element looks like /LINE_NUMBER/FIELD_NAME
const FIELD_NAME_POSITION = 2;

const formatAjv = (data: Record<string, any>, errors: ErrorObject[]) => {
  const reply = [];
  const sourceMap = jsonSourceMap.stringify(data, null, 2);
  errors.forEach((e) => {
    const parts = e.instancePath.split('/');
    const ccbcNumber = data?.[parts[LINE_NUMBER_POSITION]]?.ccbc_number ?? null;
    const errorPointer = sourceMap.pointers[e.instancePath];
    if (parts.length > MIN_PATH_DEPTH) {
      const item = {
        line: (errorPointer?.key?.line || 0) + 1,
        ccbc_number: ccbcNumber,
        message: `${parts[FIELD_NAME_POSITION]} ${e.message}`,
      };
      reply.push(item);
    } else {
      // errors on root level
      const item = {
        line: e.keyword === 'required' ? null : 1,
        ccbc_number: ccbcNumber,
        message: e.message,
      };
      reply.push(item);
    }
  });
  return { errors: reply };
};
const formatJsonLint = (errors: any[]) => {
  const reply = [];
  errors.forEach((e) => {
    const item = {
      line: e.range.start.line,
      position: e.range.start.character,
      message: e.message,
    };
    reply.push(item);
  });
  return { errors: reply };
};
// eslint-disable-next-line consistent-return
gisUpload.post('/api/analyst/gis', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'super_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const form = formidable(commonFormidableConfig);

  const files = await parseForm(form, req).catch((err) => {
    return res.status(400).json({ error: err }).end();
  });

  const filename = Object.keys(files)[0];
  const uploadedFilesArray = files[filename] as Array<File>;

  const originalFileName =
    uploadedFilesArray[0].originalFilename || 'GIS_ASSESSMENT_JSON';

  const uploaded = uploadedFilesArray?.[0];
  if (!uploaded) {
    return res.status(200).end();
  }
  const file = fs.readFileSync(uploaded.filepath, 'utf8');
  let data = null;
  try {
    const lintErrors = jsonProcessor.process(file, filename);
    if (Array.isArray(lintErrors) && lintErrors.length > 0) {
      return res.status(400).json(formatJsonLint(lintErrors)).end();
    }
    data = JSON.parse(file);
  } catch (e) {
    reportServerError(e, { source: 'gis-upload-parse' }, req);
    return res.status(400).json({ error: e }).end();
  }
  let isValid: boolean;

  try {
    isValid = ajv.validate(schema, data);
  } catch (e) {
    reportServerError(e, { source: 'gis-upload-validate' }, req);
    return res.status(400).json({ error: e }).end();
  }

  if (!isValid) {
    return res.status(400).json(formatAjv(data, ajv.errors)).end();
  }

  // time to persist in DB
  const result = await performQuery(
    saveGisDataMutation,
    { input: data, fileName: originalFileName },
    req
  ).catch((e) => {
    reportServerError(e, { source: 'gis-upload-save' }, req);
    return res.status(400).json({ error: e }).end();
  });

  const gisData = (result as any)?.data?.createGisData?.gisData;

  if (gisData) {
    return res.status(200).json({ batchId: gisData?.rowId }).end();
  }

  return res.status(400).json({ error: 'failed to save Gis data in DB' }).end();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default gisUpload;
