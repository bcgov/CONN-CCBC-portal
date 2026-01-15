import crypto from 'crypto';
import { Upload } from '@aws-sdk/lib-storage';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import fs from 'fs';
import { Readable, EventEmitter } from 'node:stream';
import { s3ClientV3 } from '../s3client';
import config from '../../../config';
import { reportServerError } from '../emails/errorNotification';

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

export const saveRemoteFile = async (stream) => {
  try {
    console.time('saveRemoteFile');

    if (!stream || !(stream instanceof Readable)) {
      throw new Error('Choose a file to upload first.');
    }

    const uuid = crypto.randomUUID();

    const uploadParams = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
      Body: stream,
    };

    const parallelUploads3 = new Upload({
      client: s3ClientV3,
      params: uploadParams,
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    (parallelUploads3 as EventEmitter).on('uncaughtException', (error) => {
      if (error instanceof Error) {
        reportServerError(error, { source: 's3-upload-uncaught' });
        throw error;
      }
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      const uploadProgressInMB =
        Math.round((progress.loaded / 1000000) * 10) / 10;
      console.log(`Uploaded ${uploadProgressInMB}MB`);
    });
    const data = await parallelUploads3.done();

    const key = (data as CompleteMultipartUploadCommandOutput)?.Key;

    if (!key) {
      throw new Error('Data does not contain a key');
    }

    return key;
  } catch (err) {
    reportServerError(err, { source: 'save-remote-file' });
    throw new Error(err instanceof Error ? err.message : String(err));
  } finally {
    console.timeEnd('saveRemoteFile');
  }
};

// NOSONAR
export const saveLocalFile = async (upload) => {
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
  }
  const { createReadStream } = upload;
  const stream = createReadStream();
  const uuid = await saveRemoteFile(stream);

  return uuid;
}
