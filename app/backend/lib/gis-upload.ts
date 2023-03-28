import { Router } from 'express';
import formidable from "formidable";
import Ajv from "ajv";
import fs from 'fs';
import schema from './gis-schema.json';

import getAuthRole from '../../utils/getAuthRole';

const gisUpload = Router();
const ajv = new Ajv({allErrors : true, removeAdditional : true });
/**  {
        instancePath: '/1/GIS PERCENT_OVERBUILD',
        schemaPath: '#/items/properties/GIS%20PERCENT_OVERBUILD/type',
        keyword: 'type',
        params: { type: 'number' },
        message: 'must be number'
      } 
 */
const formatAjv = (data, errors) => {
  const reply=[];
  errors.forEach(e => {
    const parts = e.instancePath.split('/');
    if (parts.length > 2) { 
      const item = {
        line: parseInt(parts[1],10) + 1,
        ccbc_number: data[parts[1]].ccbc_number,
        message: `${parts[2]} ${e.message}`
      }
      reply.push(item);
    }
    else { 
      const item = {
        line: 1, 
        message: e.message
      }
      reply.push(item);
    }
  });
  return reply;
}

// eslint-disable-next-line consistent-return
gisUpload.post('/api/analyst/gis', async (req, res) => {
  console.log('got the file');
  const authRole = getAuthRole(req);
  const isRoleAuthorized = authRole?.pgRole === 'ccbc_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end(); 
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err || files === undefined) {return res.status(400).json({ error: 'bad data' })}; 

    const filename = Object.keys(files)[0];     
    const uploaded = files[filename];
    const file = fs.readFileSync(uploaded.filepath, 'utf8');
    const data = JSON.parse(file);
    let results;

    try{
      results = ajv.validate(schema, data);
    }
    catch(e){
      return res.status(400).json({ error: e });
    };

    if(!results){
      return res.status(400).json(formatAjv(data, ajv.errors));
    }
    else {
      return res.status(200).json('done');
    }
  });
});

export default gisUpload;
