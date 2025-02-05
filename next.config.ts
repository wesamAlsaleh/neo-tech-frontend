import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // default is "1mb" (1 megabyte)
    },
  },
};

export default nextConfig;
