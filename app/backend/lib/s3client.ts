import config from '../../config.js';
import aws from 'aws-sdk';

const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_S3_KEY = config.get('AWS_S3_KEY');
const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');

const s3config = {
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY,
  },
};

const s3Client = new aws.S3(s3config);

export default s3Client;
