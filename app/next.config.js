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
  // swcMinify: true,
  experimental: {
    // Enable React 19 concurrent features
    ppr: false,
    reactCompiler: false,
  },
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
    SENTRY_ENVIRONMENT: convictConfig.get('SENTRY_ENVIRONMENT'),
    SENTRY_RELEASE: convictConfig.get('SENTRY_RELEASE'),
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
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
        url: false,
      };
    }

    config.resolve.extensions = ['.ts', '.tsx', '.js', '.json'];

    // Force resolve React modules to our installed versions
    const reactPath = require.resolve('react');
    const reactDomPath = require.resolve('react-dom');
    const reactJsxRuntimePath = require.resolve('react/jsx-runtime');
    const reactJsxDevRuntimePath = require.resolve('react/jsx-dev-runtime');

    config.resolve.alias = {
      ...config.resolve.alias,
      react$: reactPath,
      'react-dom$': reactDomPath,
      'react-is': require.resolve('react-is'),
      'react/jsx-runtime$': reactJsxRuntimePath,
      'react/jsx-dev-runtime$': reactJsxDevRuntimePath,
    };

    // Ensure node_modules resolution works properly
    config.resolve.modules = [
      require('path').resolve(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules || []),
    ];

    // Configure module resolution to handle React 19 properly
    config.resolve.symlinks = true;

    // Add a plugin to intercept and resolve react runtime imports in MUI packages
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^react\/jsx-runtime$/,
        reactJsxRuntimePath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^react\/jsx-dev-runtime$/,
        reactJsxDevRuntimePath
      )
    );

    return config;
  },
};

module.exports = moduleExports;
