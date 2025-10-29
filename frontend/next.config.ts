// frontend/next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; " +
              "connect-src 'self' https: http:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "object-src 'none'; " +
              "base-uri 'self';"
          }
        ],
      },
    ];
  },
};

export default nextConfig;