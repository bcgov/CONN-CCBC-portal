/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const convictConfig = require('./config');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

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
  // webpack: (config, { isServer }) => {
  //   const newConfig = { ...config };
  //   if (!isServer) {
  //     newConfig.resolve.fallback.fs = false;
  //   }
  //   newConfig.experiments = { topLevelAwait: true, layers: true };
  //   // Ask Webpack to replace @sentry/node imports with @sentry/browser when
  //   // building the browser's bundle
  //   if (!isServer) {
  //     // eslint-disable-next-line no-param-reassign
  //     config.resolve.alias['@sentry/node'] = '@sentry/browser';
  //   }
  //   // The Sentry webpack plugin gets pushed to the webpack plugins to build
  //   // and upload the source maps to sentry.
  //   config.plugins.push(
  //     new SentryWebpackPlugin({
  //       include: '.next',
  //       configFile: 'sentry.properties',
  //       release: process.env.GIT_HASH,
  //       ignore: ['node_modules'],
  //       urlPrefix: '~/_next',
  //       dryRun: true,
  //       silent: true,
  //     })
  //   );

  //   return newConfig;
  // },
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

const sentryWebpackPluginOptions = {
  // Set to false to create a sentry release on build with the sentry CLI
  // This will upload sourcemaps to sentry.
  authToken: `${process.env.SENTRY_AUTH_TOKEN}`,
  dryRun: false,
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
