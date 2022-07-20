import crypto from 'crypto';
import s3Client from '../s3client';
import config from '../../../config';
import fs from 'fs';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');
const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_S3_KEY = config.get('AWS_S3_KEY');
const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN');
const OPENSHIFT_APP_NAMESPACE = config.get('OPENSHIFT_APP_NAMESPACE');

const isDeployedToOpenShift =
  OPENSHIFT_APP_NAMESPACE.endsWith('-dev') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-test') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-prod');

const isLocalDevelopment =
  !isDeployedToOpenShift ||
  !AWS_S3_BUCKET ||
  !AWS_S3_REGION ||
  !AWS_S3_KEY ||
  !AWS_S3_SECRET_KEY ||
  !AWS_ROLE_ARN;

if (!isDeployedToOpenShift) {
  console.log(
    'No OpenShift namespace environment variable detected, running object storage in local development mode'
  );
} else if (isLocalDevelopment) {
  console.log(
    'Missing AWS S3 API keys, running object storage in local development mode'
  );
}

const saveRemoteFile = async (stream) => {
  const uuid = crypto.randomUUID();

  try {
    const uploadParams = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
      Body: stream,
    };

    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

    s3Client.upload(uploadParams, options, (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        return console.log(data);
      }
    });
    return;
  } catch (err) {
    if (!stream) {
      throw 'Choose a file to upload first.';
    }
  }
};

const saveLocalFile = async (upload) => {
  const uuid = crypto.randomUUID();
  const { createReadStream } = upload;
  const stream = createReadStream();

  const uploadDir = './uploads';
  const path = `${uploadDir}/${uuid}`;

  return new Promise((resolve, reject) => {
    stream
      .on('error', (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', (error) => reject(error))
      .on('finish', () => resolve(uuid));
  });
};

export default async function resolveFileUpload(upload) {
  if (isLocalDevelopment) {
    return saveLocalFile(upload);
  } else {
    const { createReadStream } = upload;
    const stream = createReadStream();
    const uuid = await saveRemoteFile(stream);

    return uuid;
  }
}
