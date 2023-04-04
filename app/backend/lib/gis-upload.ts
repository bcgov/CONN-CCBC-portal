import { Router } from 'express';
import formidable from 'formidable';
import Ajv from 'ajv';
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
      clientMutationId
    }
  }
`;

const gisUpload = Router();
const ajv = new Ajv({ allErrors: true, removeAdditional: true });

const formatAjv = (data, errors) => {
  const reply = [];
  errors.forEach((e) => {
    const parts = e.instancePath.split('/');
    if (parts.length > 2) {
      const item = {
        line: parseInt(parts[1], 10) + 1,
        ccbc_number: data[parts[1]].ccbc_number,
        message: `${parts[2]} ${e.message}`,
      };
      reply.push(item);
    } else {
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
  const form = new formidable.IncomingForm();
  form.maxFileSize = 8000000; 

  const files = await parseForm(form, req).catch((err) => { 
    return res.status(400).json({ error: err }).end();
  });

  const filename = Object.keys(files)[0];
  const uploaded = files[filename]; 

  const file = fs.readFileSync(uploaded.filepath, 'utf8');
  const data = JSON.parse(file); 
  let results;

  try {
    results = ajv.validate(schema, data);
  } catch (e) { 
    return res.status(400).json({ error: e }).end();
  }
 
  if (!results) {  
    return res.status(400).json(formatAjv(data, ajv.errors)).end();
  }
   
  // time to persist in DB
  await performQuery(saveGisDataMutation, {input: data}, req)
  .catch((e) => {
    return res.status(400).json({ error: e }).end();
  });

  return res.status(200).json('done').end();
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default gisUpload;
