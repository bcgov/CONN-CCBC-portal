import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  GetObjectTaggingCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

import config from '../../config/index';
import { awsS3Config } from './awsCommon';
import { reportServerError } from './emails/errorNotification';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const s3ClientV3sdk = new S3Client(awsS3Config);

export const getSignedUrlPromise = async (params) => {
  const command = new GetObjectCommand(params);
  return getSignedUrl(s3ClientV3sdk, command, { expiresIn: 3600 });
};

export const getFileFromS3 = async (uuid, filename, res) => {
  const encodedFilename = encodeURIComponent(filename);
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: uuid,
    Expires: 60,
    ResponseContentDisposition: `attachment; filename="${encodedFilename}"`,
  };
  const command = new GetObjectCommand(params);
  const signedUrl = getSignedUrl(s3ClientV3sdk, command, { expiresIn: 3600 });

  return signedUrl
    .then((url) => {
      res.json(url);
    })
    .catch((error) => {
      reportServerError(error, { source: 's3-get-file-url' });
      res.status(500).end();
    });
};

export const getByteArrayFromS3 = async (uuid) => {
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: uuid,
  };

  try {
    const command = new GetObjectCommand(params);
    const file = await s3ClientV3sdk.send(command);
    const { Body } = file;

    const byteArray = await Body.transformToByteArray();
    return byteArray;
  } catch (error) {
    reportServerError(error, { source: 's3-get-byte-array' });
    throw new Error(`Error fetching file from S3: ${error}`);
  }
};

export const streamFileFromS3 = async (uuid, filename, res) => {
  const encodedFilename = encodeURIComponent(filename);
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: uuid,
  };

  try {
    const command = new GetObjectCommand(params);
    const file = await s3ClientV3sdk.send(command);
    const { Body, ContentType } = file;

    if (!Body) {
      throw new Error('File body is empty');
    }

    // Convert to byte array (consistent with getByteArrayFromS3)
    const byteArray = await Body.transformToByteArray();
    const buffer = Buffer.from(byteArray);

    // Set appropriate headers
    res.setHeader('Content-Type', ContentType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodedFilename}"`
    );
    res.setHeader('Content-Length', buffer.length);

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    throw new Error(`Error streaming file from S3: ${error}`);
  }
};

export const checkFileExists = async (params) => {
  try {
    const command = new HeadObjectCommand(params);
    const response = await s3ClientV3sdk.send(command);
    if (response.$metadata?.httpStatusCode === 200) {
      return {
        alreadyExists: true,
        requestedAt: response?.Metadata?.['requested-at'] || null,
      };
    }
  } catch (error) {
    reportServerError(error, { source: 's3-check-file-exists' });
    return { alreadyExists: false };
  }

  return { alreadyExists: false };
};

export const getFileTagging = async (params) => {
  const noData = { TagSet: [] };
  try {
    const command = new GetObjectTaggingCommand(params);
    const response = await s3ClientV3sdk.send(command);
    if (response.$metadata?.httpStatusCode !== 200) return noData;
    return response;
  } catch (error) {
    reportServerError(error, { source: 's3-get-file-tagging' });
    return noData;
  }
};

export const uploadFileToS3 = async (params) => {
  const command = new PutObjectCommand(params);
  const response = await s3ClientV3sdk.send(command);
  if (response.$metadata?.httpStatusCode !== 200) return false;
  return true;
};

export const s3ClientV3 = s3ClientV3sdk;
