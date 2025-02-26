import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // default is "1mb" (1 megabyte)
    },
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "127.0.0.1",
  //       port: "8000",
  //       pathname: "/storage/images/products_images/**",
  //     },
  //   ],
  // },
};

export default nextConfig;
