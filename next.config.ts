import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', '@xenova/transformers', 'mammoth', 'officeparser'],
};

export default nextConfig;