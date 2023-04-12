import { Router } from 'express';
import formidable from 'formidable';
import Ajv, { ErrorObject } from 'ajv';
import fs from 'fs'; 
import RateLimit from 'express-rate-limit';
import schema from './gis-schema.json'; 
import { performQuery } from './graphql';
import getAuthRole from '../../utils/getAuthRole';

const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

const saveGisDataMutation = `
  mutation gisUploadMutation($input: JSON) {
    createGisData(input: {gisData: {jsonData:$input}}) {
      gisData {
        id,
        rowId
      },
      clientMutationId
    }
  }
`;

const saveApplicationGisDataMutation = `
  mutation gisUploadApplicationGisData($applicationId: Int, $batchId: Int, $input: JSON) {
    createApplicationGisData(
      input: {applicationGisData: {applicationId: $applicationId, batchId: $batchId, jsonData: $input}}
    ) {
      clientMutationId
    }
  }
`;


const gisUpload = Router();
const ajv = new Ajv({ allErrors: true, removeAdditional: true });

const MIN_PATH_DEPTH = 2;       // instancePath: JSON Pointer to the location in the data instance. For array we need 2.
const LINE_NUMBER_POSITION = 1; // instancePath for array element looks like /LINE_NUMBER/FIELD_NAME 
const FIELD_NAME_POSITION = 2;

const formatAjv =  (data: Record<string, any>, errors: ErrorObject[]) => {
  const reply = [];
  errors.forEach((e) => {
    const parts = e.instancePath.split('/');
    if (parts.length > MIN_PATH_DEPTH) {
      const item = {
        line: parseInt(parts[LINE_NUMBER_POSITION], 10) + 1,
        ccbc_number: data[parts[LINE_NUMBER_POSITION]].ccbc_number,
        message: `${parts[FIELD_NAME_POSITION]} ${e.message}`,
      };
      reply.push(item);
    } else {
      // errors on root level
      const item = {
        line: 1,
        message: e.message,
      };
      reply.push(item);
    }
  });
  return {errors: reply};
};

const parseForm = (form, req) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => { 
      if (err) { 
        return reject(err);
      } 
      return resolve(files);
    });
  });
};

// eslint-disable-next-line consistent-return
gisUpload.post('/api/analyst/gis', limiter, async (req, res) => { 
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

  const file = fs.readFileSync(uploaded.filepath, 'utf8');
  const data = JSON.parse(file); 
  let isValid: boolean;

  try {
    isValid = ajv.validate(schema, data);
  } catch (e) { 
    return res.status(400).json({ error: e }).end();
  }
 
  if (!isValid) {  
    return res.status(400).json(formatAjv(data, ajv.errors)).end();
  }
   
  // time to persist in DB
  const result = await performQuery(saveGisDataMutation, {input: data}, req)
  .catch((e) => {
    return res.status(400).json({ error: e }).end();
  });
  
  const newRow = JSON.parse(JSON.stringify(result));
  const gisData = newRow?.data?.createGisData?.gisData;

  if (gisData) {
    // now we can persist rows using batchId = gisData.rowId
    console.log(gisData);
  }
  return res.status(200).json('done').end();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default gisUpload;
