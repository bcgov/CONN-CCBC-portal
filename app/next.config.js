/** @type {import('next').NextConfig} */
const convictConfig = require('./config');
const relay = require('./relay.config.js');

const moduleExports = {
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
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
    relay: {
      src: relay.src,
      artifactDirectory: relay.artifactDirectory,
      language: 'typescript',
    },
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_GROWTHBOOK_API_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_API_KEY,
    ENABLE_MOCK_TIME: convictConfig.get('ENABLE_MOCK_TIME'),
    OPENSHIFT_APP_NAMESPACE: convictConfig.get('OPENSHIFT_APP_NAMESPACE'),
    SITEMINDER_LOGOUT_URL: convictConfig.get('SITEMINDER_LOGOUT_URL'),
    COVERAGES_FILE_NAME: convictConfig.get('COVERAGES_FILE_NAME'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'live.staticflickr.com',
      'news.gov.bc.ca',
      'gov.bc.ca',
      'www2.gov.bc.ca',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.json'];
    return config;
  },
};

module.exports = moduleExports;
