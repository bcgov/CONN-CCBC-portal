import next from 'next';
import express from 'express';
import passport from 'passport';
import delay from 'delay';
import http from 'http';
import { createLightship } from 'lightship';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/nextjs';
// eslint-disable-next-line import/extensions
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import readinessTest from './backend/lib/readinessTests';
import { pgPool } from './backend/lib/setup-pg';
import config from './config';
import session from './backend/lib/session';
import ssoMiddleware from './backend/lib/sso-middleware';
import headersMiddleware from './backend/lib/headers';
import graphQlMiddleware from './backend/lib/graphql';
import s3archive from './backend/lib/s3archive';
import s3download from './backend/lib/s3download';
import logout from './backend/lib/logout';
import login from './backend/lib/login';
import s3adminArchive from './backend/lib/s3admin-archive';
import importJsonSchemasToDb from './backend/lib/importJsonSchemasToDb';

importJsonSchemasToDb();

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

  // passport needed to use req.logout() and req.session.destroy() in login.ts and logout.ts
  server.use(passport.initialize());

  const { middleware: sessionMiddleware } = session();

  server.use(sessionMiddleware);

  server.use(await ssoMiddleware());

  server.use(graphqlUploadExpress());

  server.use(graphQlMiddleware());
  server.use(headersMiddleware());

  server.use('/', s3adminArchive);
  server.use('/', s3archive);
  server.use('/', s3download);
  server.use('/', login);
  server.use('/', logout);

  server.all('*', async (req, res) => handle(req, res));

  http
    .createServer(server)
    .listen(port, async () => {
      console.log(`> Ready on http://localhost:${port}`);
      await readinessTest(pgPool, lightship);
    })
    .on('error', (err) => {
      console.error(err);
      if (config.get('SENTRY_ENVIRONMENT')) {
        Sentry.captureException(err);
      }
      lightship.shutdown();
    });
});
