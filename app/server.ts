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
import morgan from 'morgan';
import linkPreview from './backend/lib/linkPreview';
import readinessTest from './backend/lib/readinessTests';
import { pgPool } from './backend/lib/setup-pg';
import config from './config';
import session from './backend/lib/session';
import ssoMiddleware from './backend/lib/sso-middleware';
import headersMiddleware from './backend/lib/headers';
import graphQlMiddleware from './backend/lib/graphql';
import s3download from './backend/lib/s3download';
import claimsUpload from './backend/lib/claims-upload';
import milestoneUpload from './backend/lib/milestone-upload';
import communityReportUpload from './backend/lib/community-report-upload';
import gisUpload from './backend/lib/gis-upload';
import sowUpload from './backend/lib/sow-upload';
import logout from './backend/lib/logout';
import login from './backend/lib/login';
import s3adminArchive from './backend/lib/s3admin-archive';
import importJsonSchemasToDb from './backend/lib/importJsonSchemasToDb';
import metabaseEmbedUrl from './backend/lib/metabase-embed-url';
import sharepoint from './backend/lib/sharepoint';
import templateUpload from './backend/lib/template-upload';

// Function to exclude middleware from certain routes
// The paths argument takes an array of strings containing routes to exclude from the middleware
const unless = (paths, middleware) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return (req, res, nexthandler) => {
    if (
      paths.includes(req.path) ||
      paths.find((path) => req.path.includes(path))
    ) {
      return nexthandler();
    }
    return middleware(req, res, nexthandler);
  };
};

importJsonSchemasToDb();

const port = config.get('PORT');
const dev = config.get('NODE_ENV') !== 'production';
const OPENSHIFT_APP_NAMESPACE = config.get('OPENSHIFT_APP_NAMESPACE');

const isDeployedToOpenShift =
  OPENSHIFT_APP_NAMESPACE.endsWith('-dev') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-test') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-prod');

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

  server.use(
    morgan(
      '[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms'
    )
  );

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

  server.use(
    unless(
      [
        '/api/analyst/sow',
        '/api/analyst/gis',
        'api/analyst/community-report',
        'api/analyst/claims',
        'api/analyst/milestone',
        '/api/applicant/template',
      ],
      graphqlUploadExpress()
    )
  );

  server.use(graphQlMiddleware());
  server.use(headersMiddleware());

  server.use('/', s3adminArchive);
  server.use('/', s3download);
  server.use('/', claimsUpload);
  server.use('/', communityReportUpload);
  server.use('/', gisUpload);
  server.use('/', milestoneUpload);
  server.use('/', linkPreview);
  server.use('/', sowUpload);
  server.use('/', login);
  server.use('/', logout);
  server.use('/', metabaseEmbedUrl);
  server.use('/', sharepoint);
  server.use('/', templateUpload);

  server.all('*', async (req, res) => handle(req, res));

  http
    .createServer(server)
    .listen(port, async () => {
      console.log(`> Ready on http://localhost:${port}`);
      if (!isDeployedToOpenShift) {
        lightship.signalReady();
      } else {
        await readinessTest(pgPool, lightship);
      }
    })
    .on('error', (err) => {
      console.error(err);
      if (config.get('SENTRY_ENVIRONMENT')) {
        Sentry.captureException(err);
      }
      lightship.shutdown();
    });
});
