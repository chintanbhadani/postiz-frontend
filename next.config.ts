import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  trailingSlash: true,
  // Allow development mode on the VPS IP
  allowedDevOrigins: ['187.127.171.3', 'localhost', 'daf7-2409-40c1-1002-3e56-749b-22e8-7e25-3ea9.ngrok-free.app'],
};

export default nextConfig;
