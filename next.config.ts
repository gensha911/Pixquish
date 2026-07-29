import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: {
    appIcon: false,
  },
  allowedDevOrigins: [
    "preview-chat-db7ccf3f-d757-4e90-bb68-8d7d4c7c6728.space-z.ai",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;