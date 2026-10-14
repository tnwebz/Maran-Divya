import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standard Next.js client image handling
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
