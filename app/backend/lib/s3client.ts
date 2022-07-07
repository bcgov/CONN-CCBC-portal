import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config.js';

const S3_REGION = config.get('S3_REGION');
const S3_KEY = config.get('S3_KEY');
const S3_SECRET_KEY = config.get('S3_SECRET_KEY');

const s3config = {
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
};

const s3Client = new S3Client(s3config);

export default s3Client;
