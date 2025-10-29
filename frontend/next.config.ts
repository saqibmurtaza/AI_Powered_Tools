// frontend/next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Explicitly tell Next.js that the root is the current directory
  turbopack: {
    root: "./",
  },

  // ✅ Security headers (you already had this, kept exactly as is)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; " +
              "connect-src 'self' https: http:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "object-src 'none'; " +
              "base-uri 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
