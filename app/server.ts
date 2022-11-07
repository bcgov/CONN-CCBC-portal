import next from 'next';
import express from 'express';
import delay from 'delay';
import http from 'http';
import { createLightship } from 'lightship';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { pgPool } from './backend/lib/setup-pg';
import config from './config';
import session from './backend/lib/session';
import ssoMiddleware from './backend/lib/sso-middleware';
import headersMiddleware from './backend/lib/headers';
import graphQlMiddleware from './backend/lib/graphql';
import s3archive from './backend/lib/s3archive';

const port = config.get('PORT');
const dev = config.get('NODE_ENV') !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const { json, urlencoded } = bodyParser;
const bodyParserLimit = '5mb';
app.prepare().then(async () => {
  const server = express();

  const lightship = createLightship();

  lightship.registerShutdownHandler(async () => {
    // Allow the server to send any in-flight requests before shutting down
    await delay(10000);
    await app.close();
    await pgPool.end();
  });

  server.use(json({ limit: bodyParserLimit }));

  server.use(urlencoded({ extended: false, limit: bodyParserLimit }));

  server.use(cookieParser());

  server.disable('x-powered-by'); // at minimum, disable x-powered-by header
  server.set('trust proxy', 1); // trust first proxy

  const { middleware: sessionMiddleware } = session();

  server.use(sessionMiddleware);

  server.use(await ssoMiddleware());

  server.use(graphqlUploadExpress());

  server.use(graphQlMiddleware());

  server.use(headersMiddleware());

  server.use('/', s3archive);

  server.all('*', async (req, res) => handle(req, res));

  http
    .createServer(server)
    .listen(port, () => {
      lightship.signalReady();
      console.log(`> Ready on http://localhost:${port}`);
    })
    .on('error', (err) => {
      console.error(err);
      lightship.shutdown();
    });
});
