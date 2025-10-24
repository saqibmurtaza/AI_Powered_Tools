// frontend/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // More permissive version
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:;"
        }
      ],
    },
  ];
},
}

export default nextConfig