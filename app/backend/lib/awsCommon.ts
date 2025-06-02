import http from 'https';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { SNSClientConfig } from '@aws-sdk/client-sns';
import config from '../../config';
import CustomHttpsAgent from './CustomHttpsAgent';

const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN');
// const ENABLE_AWS_LOGS = config.get('ENABLE_AWS_LOGS');

const httpsAgent = new CustomHttpsAgent();
const httpAgent = new http.Agent({
  maxSockets: 300,
  keepAlive: true,
});

const nodeHandler = new NodeHttpHandler({
  httpAgent,
  httpsAgent,
  connectionTimeout: 30000,
});

let awsConfig: any;
try {
  awsConfig = {
    region: AWS_S3_REGION,
    requestHandler: nodeHandler,
    credentials: fromTemporaryCredentials({
      masterCredentials: fromEnv(),
      params: {
        RoleArn: AWS_ROLE_ARN,
        RoleSessionName: `s3-v3-role-session-${Date.now()}`,
        DurationSeconds: 3600,
      },
      clientConfig: { region: AWS_S3_REGION },
    }),
  };
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn(
    'AWS SDK not configured: missing or invalid credentials. S3/SNS will not be available.'
  );
  awsConfig = {
    region: AWS_S3_REGION,
    requestHandler: nodeHandler,
    credentials: undefined,
  };
}

export const awsS3Config: S3ClientConfig = {
  ...awsConfig,
};

export const awsSNSConfig: SNSClientConfig = {
  ...awsConfig,
};
