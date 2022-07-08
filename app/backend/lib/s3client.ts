import config from '../../config.js';
import aws from 'aws-sdk';

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

const s3Client = new aws.S3(s3config);

export default s3Client;
