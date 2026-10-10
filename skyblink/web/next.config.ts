import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phones on this Wi-Fi open the dev server by IP. Without this, Next.js
  // blocks the scripts that draw the sky.
  allowedDevOrigins: ["192.168.0.108"],
};

export default nextConfig;
