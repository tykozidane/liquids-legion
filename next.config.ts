import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.BASE_PATH,
  env: {
    API_URL: process.env.BASE_URL_API
  }
};

export default nextConfig;
