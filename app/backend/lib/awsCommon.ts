/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import https from 'https';
import http from 'http';
import {
  fromTemporaryCredentials,
  fromEnv,
} from '@aws-sdk/credential-providers';

import { Socket } from 'net';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { TLSSocket } from 'tls';
import config from '../../config';

console.log('is this working');

class CustomHtttpAgent extends http.Agent {
  createConnection(options, callback) {
    let asdf;
    const start = Date.now();
    // @ts-ignore
    const conn: Socket = super.createConnection(options, callback);
    conn.on('lookup', (_err, address, _fam, host) => {
      console.log(
        `Currently trying to connect to: ${address} for host: ${host}`
      );
      asdf = address;
    });
    conn.on('error', () => {
      const end = Date.now();
      console.log(`Connection failed with time: ${end - start}ms`);
      console.log(
        `Connection failed to connect to ${asdf} for host ${options.host}`
      );
    });
    return conn;
  }
}

class CustomHtttpsAgent extends https.Agent {
  createConnection(options, callback) {
    let asdf;
    const start = Date.now();
    // @ts-ignore
    const conn: Socket = super.createConnection(options, callback);
    conn.on('lookup', (_err, address, _fam, host) => {
      console.log(
        `Currently trying to connect to: ${address} for host: ${host}`
      );
      asdf = address;
    });
    conn.on('error', () => {
      const end = Date.now();
      console.log(`Connection failed with time: ${end - start}ms`);
      console.log(
        `Connection failed to connect to ${asdf} for host ${options.host}`
      );
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
const nodeHandler = new NodeHttpHandler({
  httpAgent: agent,
  httpsAgent,
});

const awsConfig = {
  region: AWS_S3_REGION,
  // logger: console,
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

// const awsConfiguration: S3ClientConfig = {
//   region: AWS_S3_REGION,
//   logger: console,
//   credentials: fromTemporaryCredentials({
//     masterCredentials: fromEnv(),
//     params: {
//       RoleArn: AWS_ROLE_ARN,
//       RoleSessionName: `s3-v3-role-session-${Date.now()}`,
//       // we confirmed that when the temporary credentials expire this factory is documented to use the master credentials to refresh the temporary
//       DurationSeconds: 3600,
//     },
//     clientConfig: { region: AWS_S3_REGION },
//   }),
//   requestHandler:
// };

export default awsConfig;
