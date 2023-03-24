import crypto, { randomBytes } from 'crypto';
import { Upload } from '@aws-sdk/lib-storage';
import * as Sentry from '@sentry/nextjs';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import fs from 'fs';
import { EventEmitter } from 'node:stream';
import { s3ClientV3 } from '../s3client';
import config from '../../../config';

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

export const saveRemoteFile = async () => {
  const transaction = Sentry.startTransaction({ name: 'ccbc.function' });
  const span = transaction.startChild({
    op: 'resolve-file-upload',
    description: 'resolveFileUpload saveRemoteFile function',
  });
  span.setData('start-of-funciton-call', new Date().toISOString());

  const uuid = crypto.randomUUID();
  try {
    // if (!stream || !(stream instanceof Readable)) {
    //   throw new Error('Choose a file to upload first.');
    // }

    const fileSize = 4 * 1024 * 1024; // 10MB in bytes
    const chunkSize = 1024 * 1024; // 1MB chunks

    const buffer = Buffer.alloc(fileSize);

    for (let i = 0; i < fileSize; i += chunkSize) {
      const chunk = randomBytes(chunkSize);
      chunk.copy(buffer, i);
    }

    console.time(`'saveRemoteFile': ${uuid}`);

    const uploadParams = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
      Body: buffer,
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
        Sentry.captureException(error);
        throw error;
      }
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      const uploadProgressInMB =
        Math.round((progress.loaded / 1000000) * 10) / 10;
      console.log(`Uploaded ${uploadProgressInMB}MB`);
      transaction.setMeasurement('memoryUsed', uploadProgressInMB, 'megabtye');
    });
    span.setData('upload-start', new Date().toISOString());
    const data = await parallelUploads3.done();
    span.setData('upload-finish', new Date().toISOString());

    const key = (data as CompleteMultipartUploadCommandOutput)?.Key;

    if (!key) {
      throw new Error('Data does not contain a key');
    }

    span.setStatus('ok');
    span.finish();
    transaction.finish();

    return key;
  } catch (err) {
    span.setData('error-obj', err);
    span.setStatus('unknown_error');
    span.finish();
    transaction.finish();

    console.log('Error', err);
    throw new Error(err);
  } finally {
    console.timeEnd(`'saveRemoteFile': ${uuid}`);
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
  // const { createReadStream } = upload;
  // const stream = createReadStream();
  const uuid = await saveRemoteFile();

  return uuid;
}
