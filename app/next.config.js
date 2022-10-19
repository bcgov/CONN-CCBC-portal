/** @type {import('next').NextConfig} */

const convictConfig = require('./config');

module.exports = {
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/applicantportal',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    const newConfig = { ...config };
    if (!isServer) {
      newConfig.resolve.fallback.fs = false;
    }
    newConfig.experiments = { topLevelAwait: true, layers: true };

    return newConfig;
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_GROWTHBOOK_API_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_API_KEY,
    ENABLE_MOCK_TIME: convictConfig.get('ENABLE_MOCK_TIME'),
    OPENSHIFT_APP_NAMESPACE: convictConfig.get('OPENSHIFT_APP_NAMESPACE'),
    SITEMINDER_LOGOUT_URL: convictConfig.get('SITEMINDER_LOGOUT_URL'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
