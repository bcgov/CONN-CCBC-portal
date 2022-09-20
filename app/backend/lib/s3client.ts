import config from '../../config/index.js';
import aws from 'aws-sdk';

const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_S3_KEY = config.get('AWS_S3_KEY');
const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN');

aws.config.update({
  credentials: new aws.ChainableTemporaryCredentials({
    params: {
      RoleArn: AWS_ROLE_ARN,
      RoleSessionName: `s3-role-session-${Date.now()}`,
      DurationSeconds: 15 * 60,
    },
    masterCredentials: new aws.Credentials({
      accessKeyId: AWS_S3_KEY,
      secretAccessKey: AWS_S3_SECRET_KEY,
    }),
  }),

  region: AWS_S3_REGION,
});

const s3Client = new aws.S3();

export default s3Client;
