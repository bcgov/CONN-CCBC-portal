// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import getConfig from 'next/config';

const { SENTRY_ENVIRONMENT, SENTRY_RELEASE } =
  getConfig().publicRuntimeConfig || {};

const SENTRY_DSN = SENTRY_ENVIRONMENT
  ? 'https://d6719b95640e48e28369cd152b9ea9e5@o4504057667649536.ingest.sentry.io/4504079285944320'
  : null;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,
});
