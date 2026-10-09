import type { NextConfig } from "next";

// Für GitHub Pages unter /<repo> wird NEXT_PUBLIC_BASE_PATH im Workflow gesetzt.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
