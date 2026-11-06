import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Pin the project root; there's a stray package-lock.json in the home folder.
  turbopack: { root: __dirname },
};

export default nextConfig;
