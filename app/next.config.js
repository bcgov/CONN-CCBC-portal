/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// module.exports = nextConfig

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.experiments = { topLevelAwait: true, layers: true };

    return config;
  },
  nextConfig,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
};
