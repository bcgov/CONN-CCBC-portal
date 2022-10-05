/** @type {import('next').NextConfig} */

const config = require('./config');

module.exports = {
  basePath: '/applicantportal',
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/applicantportal',
        basePath: false,
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.experiments = { topLevelAwait: true, layers: true };

    return config;
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_GROWTHBOOK_API_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_API_KEY,
    ENABLE_MOCK_TIME: config.get('ENABLE_MOCK_TIME'),
    OPENSHIFT_APP_NAMESPACE: config.get('OPENSHIFT_APP_NAMESPACE'),
    SITEMINDER_LOGOUT_URL: config.get('SITEMINDER_LOGOUT_URL'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
