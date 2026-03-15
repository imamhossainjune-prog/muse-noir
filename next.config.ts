import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', '@xenova/transformers'],
};

export default nextConfig;