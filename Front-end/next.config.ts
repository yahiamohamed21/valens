import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "valens-api.runasp.net",
      },
      {
        protocol: "https",
        hostname: "valens-api.runasp.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5054",
      },
    ],
  },
};

export default nextConfig;