/* eslint-disable max-classes-per-file */
import https from 'https';
import http from 'http';
import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';

import { Socket } from 'net';
import config from '../../config';

class CustomHtttpAgent extends http.Agent {
  createConnection(options, callback) {
    const start = Date.now();
    // @ts-ignore
    const conn = super.createConnection(options, (error, socket: Socket) => {
      const end = Date.now();
      console.log(
        `Connection failed with AWS to: ${options.host} with IP: ${socket.remoteAddress}`
      );
      console.log(`Connectil failed with time: ${end - start}ms`);
      callback(error, socket);
    });
    return conn;
  }
}

class CustomHtttpsAgent extends https.Agent {
  createConnection(options, callback) {
    const start = Date.now();
    // @ts-ignore
    const conn = super.createConnection(options, (error, socket: Socket) => {
      const end = Date.now();
      console.log(
        `Connection failed with AWS to: ${options.host} with IP: ${socket.remoteAddress}`
      );
      console.log(`Connection failed with time: ${end - start}ms`);
      callback(error, socket);
    });
    return conn;
  }
}

const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_ROLE_ARN = config.get('AWS_ROLE_ARN');

const agent = new CustomHtttpAgent({
  maxSockets: 300,
  keepAlive: true,
});

const httpsAgent = new CustomHtttpsAgent();

const awsConfig = {
  region: AWS_S3_REGION,
  logger: console,
  httpOptions: {
    timeout: 45000,
    connectTimeout: 45000,
    agent,
    httpsAgent,
  },
  maxRetries: 10,
  retryDelayOptions: {
    base: 500,
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
  }),
};

export default awsConfig;
