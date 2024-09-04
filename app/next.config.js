/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const convictConfig = require('./config');

const moduleExports = {
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/applicantportal',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.connectingcommunitiesbc.ca' }],
        destination: `https://connectingcommunitiesbc.ca/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/analyst/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: '',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,

  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  generateBuildId: async () => {
    return process.env.GIT_HASH;
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_GROWTHBOOK_API_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_API_KEY,
    ENABLE_MOCK_TIME: convictConfig.get('ENABLE_MOCK_TIME'),
    OPENSHIFT_APP_NAMESPACE: convictConfig.get('OPENSHIFT_APP_NAMESPACE'),
    SITEMINDER_LOGOUT_URL: convictConfig.get('SITEMINDER_LOGOUT_URL'),
    SENTRY_ENVIRONMENT: convictConfig.get('SENTRY_ENVIRONMENT'),
    SENTRY_RELEASE: convictConfig.get('SENTRY_RELEASE'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  sentry: {
    tunnelRoute: undefined,
  },
  images: {
    domains: [
      'live.staticflickr.com',
      'news.gov.bc.ca',
      'gov.bc.ca',
      'www2.gov.bc.ca',
    ],
  },
};

const sentryOptions = {
  // Set to false to create a sentry release on build with the sentry CLI
  // This will upload sourcemaps to sentry.
  authToken: `${process.env.SENTRY_AUTH_TOKEN}`,
  dryRun: false,
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryOptions);
