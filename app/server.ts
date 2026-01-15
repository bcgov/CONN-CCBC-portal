import next from 'next';
import express from 'express';
import passport from 'passport';
import delay from 'delay';
import http from 'http';
import { createLightship } from 'lightship';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import morgan from 'morgan';
import {
  gbClient,
  initializeGrowthBook,
} from './backend/lib/growthbook-client';
import reporting from './backend/lib/reporting/reporting';
import validation from './backend/lib/validation';
import email from './backend/lib/emails/email';
import linkPreview from './backend/lib/linkPreview';
import readinessTest from './backend/lib/readinessTests';
import { pgPool } from './backend/lib/setup-pg';
import config from './config';
import { reportServerError } from './backend/lib/emails/errorNotification';
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
import coveragesUpload from './backend/lib/coverages-upload';
import templateNine from './backend/lib/excel_import/template_nine';
import milestoneDue from './backend/lib/milestoneDueDate';
import communityReport from './backend/lib/communityReportsDueDate';
import map from './backend/lib/map/map';
import dashboardExport from './backend/lib/dashboard/dashboard_export';
import intake from './backend/lib/intake';
import cbc from './backend/lib/cbc/cbc';
import changeLog from './backend/lib/change_log/change_log';

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

  const lightship = await createLightship();

  lightship.registerShutdownHandler(async () => {
    // Allow the server to send any in-flight requests before shutting down
    await delay(10000);
    await app.close();
    await pgPool.end();
  });
  const logs = morgan(
    '[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms'
  );
  server.use((req, res, _next) => {
    // need to wait for request/response to finish first before we get status code
    res.on('finish', () => {
      // if we get a 404 on a static resource, we want to log it
      if (res.statusCode === 404 && req.url.includes('static')) {
        reportServerError(new Error(`Static Resource 404: ${req.url}`), {
          source: 'static-resource-404',
          metadata: { url: req.url },
        });
      }
    });
    // continue logging
    logs(req, res, _next);
  });

  server.use(json({ limit: bodyParserLimit }));

  server.use(urlencoded({ extended: false, limit: bodyParserLimit }));

  server.use(cookieParser());

  server.disable('x-powered-by'); // at minimum, disable x-powered-by header
  server.set('trust proxy', 1); // trust first proxy

  // passport needed to use req.logout() and req.session.destroy() in login.ts and logout.ts
  server.use(passport.initialize());

  // Initialize growthbook client from the shared module
  await initializeGrowthBook();
  // Refresh once every 1 minute
  setInterval(() => gbClient.refreshFeatures(), 1 * 60 * 1000);

  const { middleware: sessionMiddleware } = session();

  server.use(sessionMiddleware);

  server.use(await ssoMiddleware());

  server.use(
    unless(
      [
        '/api/analyst/sow',
        '/api/analyst/gis',
        '/api/coverages/upload',
        'api/analyst/community-report',
        'api/analyst/claims',
        'api/analyst/milestone',
        '/api/applicant/template',
        '/api/template-nine/rfi',
      ],
      graphqlUploadExpress()
    )
  );

  server.use(graphQlMiddleware());
  server.use(headersMiddleware());

  server.use('/', s3adminArchive);
  server.use('/', s3download);
  server.use('/', coveragesUpload);
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
  server.use('/', email);
  server.use('/', reporting);
  server.use('/', templateNine);
  server.use('/', validation);
  server.use('/', milestoneDue);
  server.use('/', communityReport);
  server.use('/', map);
  server.use('/', dashboardExport);
  server.use('/', intake);
  server.use('/', cbc);
  server.use('/', changeLog);

  server.all('*', async (req, res) => handle(req, res));

  http
    .createServer(server)
    .listen(port, async () => {
      // eslint-disable-next-line no-console
      console.log(`> Ready on http://localhost:${port}`);
      if (!isDeployedToOpenShift) {
        lightship.signalReady();
      } else {
        await readinessTest(pgPool, lightship);
      }
    })
    .on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      reportServerError(err, { source: 'http-server' });
      lightship.shutdown();
    });
});
