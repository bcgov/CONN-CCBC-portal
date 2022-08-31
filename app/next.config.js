/** @type {import('next').NextConfig} */

// module.exports = nextConfig

module.exports = {
  basePath: '/applicantportal',

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
  },
};
