import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  trailingSlash: true,
  // Allow development mode on the VPS IP
  allowedDevOrigins: ['187.127.171.3', 'localhost', 'a060-2405-f600-37-221d-61d1-8a08-4d2d-fabb.ngrok-free.app'],
};

export default nextConfig;
