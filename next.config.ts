import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  // Allow development mode on the VPS IP
  allowedDevOrigins: ['187.127.171.3', 'localhost', 'reminiscent-ectogenous-amie.ngrok-free.dev'],
};

export default nextConfig;
