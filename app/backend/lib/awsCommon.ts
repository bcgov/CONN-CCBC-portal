import http from 'https';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';
import config from '../../config';
import CustomHttpsAgent from './CustomHttpsAgent';

const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN');

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

const awsConfig = {
  region: AWS_S3_REGION,
  logger: console,
  requestHandler: nodeHandler,
  credentials: fromTemporaryCredentials({
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

export default awsConfig;
