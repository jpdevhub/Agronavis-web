import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Notes for anyone running this on a different machine ───────────────────
  // This project lives on an exFAT volume, where macOS writes AppleDouble "._"
  // sidecar files next to everything. Two Next.js subsystems choke on them:
  //
  //  1. The image optimizer serves the "._" sidecar out of its cache directory
  //     instead of the real image, so every <Image> renders broken.
  //  2. Turbopack's filesystem cache fails to parse the sidecar names and dies
  //     with "Failed to open database / invalid digit found in string".
  //
  // Both settings below work around that. On an APFS volume you can delete them
  // and get image optimization and cross-run caching back.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  agentRules: false,
};

export default nextConfig;
