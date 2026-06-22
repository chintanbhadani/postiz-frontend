import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  trailingSlash: true,
  // Allow development mode on the VPS IP
  allowedDevOrigins: ['187.127.171.3', 'localhost', 'f1be-2405-f600-37-12fd-bde1-d65b-fbdb-b410.ngrok-free.app'],
};

export default nextConfig;
