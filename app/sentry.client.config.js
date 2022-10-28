// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { SENTRY_ENVIRONMENT, SENTRY_RELEASE } =
  getConfig().publicRuntimeConfig || {};

const SENTRY_DSN = SENTRY_ENVIRONMENT
  ? 'https://ed6b3cb9ea6a470f870a0169ec43146b@o4504057667649536.ingest.sentry.io/4504057888374784'
  : null;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,
});
