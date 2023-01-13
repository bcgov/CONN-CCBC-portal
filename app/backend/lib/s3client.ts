import aws from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import { getApplyMd5BodyChecksumPlugin } from '@aws-sdk/middleware-apply-body-checksum';

import config from '../../config/index';
import {awsConfig} from './awsCommon'

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const s3Client = new aws.S3();

export default s3Client;

const s3ClientV3sdk = new S3Client(awsConfig);
s3ClientV3sdk.middlewareStack.use(
    getApplyMd5BodyChecksumPlugin(s3ClientV3sdk.config)
);

export const getFileFromS3 = (uuid, filename, res) => {
  const signedUrl = s3Client.getSignedUrlPromise('getObject', {
    Bucket: AWS_S3_BUCKET,
    Key: uuid,
    Expires: 60,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });

  return signedUrl
    .then((url) => {
      res.json(url);
    })
    .catch(() => {
      res.status(500).end();
    });
}
export const checkFileExists = async (params) =>{
  try {
    await s3Client.headObject(params).promise();  
  } catch (error) {
      return false;
  }
  return true;
}
export const s3ClientV3 = s3ClientV3sdk;
