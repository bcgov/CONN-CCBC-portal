/** @type {import('next').NextConfig} */
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
    resolveAlias: {
      fs: {
        browser: './empty-module.ts',
      },
      // leaflet.fullscreen's UMD wrapper does an optional `require('screenfull')`
      // that was never a real dependency of this project; Next's supported
      // browser baseline (Chrome/Edge/Firefox 111+, Safari 16.4+) all have
      // native Fullscreen API support, so this legacy fallback is unneeded.
      screenfull: {
        browser: './empty-module.ts',
      },
      '~*': '*',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'live.staticflickr.com' },
      { protocol: 'https', hostname: 'news.gov.bc.ca' },
      { protocol: 'https', hostname: 'gov.bc.ca' },
      { protocol: 'https', hostname: 'www2.gov.bc.ca' },
    ],
  },
};

module.exports = moduleExports;
