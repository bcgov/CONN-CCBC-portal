// Next.js 16 removed `next/config` (publicRuntimeConfig/serverRuntimeConfig).
// TODO(next-16-upgrade): this is a stopgap, not the real replacement. It reads
// plain (non-`NEXT_PUBLIC_`) env vars, which only resolve correctly on the
// server — the Docker image is built with no NEXT_PUBLIC_* build args, so
// these values are injected by Helm at container start, not at `next build`
// time. In the browser bundle these will read as `undefined`/falsy until a
// proper runtime-injection channel (e.g. serializing config into
// `_document.tsx` as `window.__ENV__`) replaces this.
const publicRuntimeConfig = {
  NEXT_PUBLIC_GROWTHBOOK_API_KEY:
    process.env.NEXT_PUBLIC_GROWTHBOOK_API_KEY || '',
  ENABLE_MOCK_TIME: process.env.ENABLE_MOCK_TIME === 'true',
  OPENSHIFT_APP_NAMESPACE: process.env.OPENSHIFT_APP_NAMESPACE || '',
  SITEMINDER_LOGOUT_URL: process.env.SITEMINDER_LOGOUT_URL || '',
  COVERAGES_FILE_NAME:
    process.env.COVERAGES_FILE_NAME ||
    'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
};

export default publicRuntimeConfig;
