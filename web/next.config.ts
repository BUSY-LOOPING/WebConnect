import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',       
  reactCompiler: true,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,  
  },
};

export default nextConfig;
