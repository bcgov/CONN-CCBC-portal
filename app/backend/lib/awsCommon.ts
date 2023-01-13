import https from 'https'; 
import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';

import config from '../../config';

const AWS_S3_REGION = config.get('AWS_S3_REGION'); 
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN'); 

const agent = new https.Agent({
  maxSockets: 300,
  keepAlive: true
 });

export const awsConfig = {
  region: AWS_S3_REGION,
  logger: console,
  httpOptions: {
    timeout: 45000,
    connectTimeout: 45000,
    agent
  },
  maxRetries: 10,
  retryDelayOptions: {
    base: 500
  },
  credentials: fromTemporaryCredentials({
    masterCredentials: fromEnv(),
    params: {
      RoleArn: AWS_ROLE_ARN,
      RoleSessionName: `s3-v3-role-session-${Date.now()}`,
      // we confirmed that when the temporary credentials expire this factory is documented to use the master credentials to refresh the temporary
      DurationSeconds: 3600,
    },
    clientConfig: { region: AWS_S3_REGION },
  }
  ),
};
