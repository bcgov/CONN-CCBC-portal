import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import formidable, { File } from 'formidable';
import fs from 'fs';
import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';
import { uploadFileToS3 } from './s3client';
import { commonFormidableConfig, parseForm } from './express-helper';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

const s3upload = Router();

s3upload.post('/api/s3/upload', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'ccbc_auth_user' ||
    authRole?.pgRole === 'cbc_admin' ||
    authRole?.pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const form = formidable(commonFormidableConfig);
  const files = await parseForm(form, req).catch((err) => {
    return res.status(400).json({ error: err }).end();
  });

  const filename = Object.keys(files)[0];
  const originalFilename = files[filename]?.[0].originalFilename;
  const uploadedFilesArray = files[filename] as Array<File>;

  const uploaded = uploadedFilesArray?.[0];
  if (!uploaded) {
    return res.status(200).end();
  }
  const file = fs.readFileSync(uploaded.filepath);

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: originalFilename,
    Body: file,
  };

  const uploadResult = await uploadFileToS3(params);
  if (uploadResult) {
    return res.json({ status: 'success' });
  }

  return res.status(200).end();
});

export default s3upload;
