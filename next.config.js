/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Only include mongodb on the server side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        fs: false,
        net: false,
        tls: false,
        'timers/promises': false,
      };
    }
    return config;
  },
  // Make sure environment variables are accessible
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Add Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none'",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;