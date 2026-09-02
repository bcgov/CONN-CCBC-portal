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
  typescript: {
    // tests/ are excluded here so the production build's typecheck isn't
    // gated on test-file types; ts-jest still typechecks them in `yarn jest`.
    tsconfigPath: './tsconfig.build.json',
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
    resolveAlias: {
      fs: {
        browser: './empty.ts',
      },
      // Some node_modules CSS (e.g. leaflet-defaulticon-compatibility) uses the
      // legacy webpack tilde convention for node_modules-relative url()s.
      '~*': '*',
      // leaflet.fullscreen's UMD wrapper does `require('screenfull')` but the
      // actual screenfull implementation is inlined in the same file, so the
      // required value is discarded; the package isn't a real dependency.
      screenfull: './empty.ts',
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
