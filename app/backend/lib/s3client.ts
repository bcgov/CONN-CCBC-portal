import aws from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';
import config from '../../config/index';

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

const awsConfig = {
  region: AWS_S3_REGION,
  credentials: fromTemporaryCredentials({
    // fromEnv() pulling these env vars:
    // AWS_ACCESS_KEY_ID
    // AWS_SECRET_ACCESS_KEY
    masterCredentials: fromEnv(),
    params: {
      RoleArn: AWS_ROLE_ARN,
      RoleSessionName: `s3-v3-role-session-${Date.now()}`,
      // we confirmed that when the temporary credentials expire this factory is documented to use the master credentials to refresh the temporary
      DurationSeconds: 3600,
    },
    clientConfig: { region: AWS_S3_REGION },
  }),
};

export const s3ClientV3 = new S3Client(awsConfig);
