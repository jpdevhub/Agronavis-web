import type { NextConfig } from 'next';

// The local checkout lives on an exFAT volume, where macOS writes AppleDouble
// "._" sidecar files next to everything. Next's image optimizer serves those
// sidecar bytes instead of the cached image, and Turbopack's filesystem cache
// fails to open its database. Neither happens on a Linux build host, so the
// workarounds are scoped to local development only.
const onCI = !!process.env.VERCEL || process.env.CI === '1' || process.env.CI === 'true';

const nextConfig: NextConfig = {
  images: {
    // Optimize on Vercel/CI; serve the pre-compressed originals locally.
    unoptimized: !onCI,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    turbopackFileSystemCacheForDev: onCI,
    turbopackFileSystemCacheForBuild: onCI,
  },
  agentRules: false,
};

export default nextConfig;
