import { fileURLToPath } from "node:url";
import path from "node:path";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: dirname,
  },
};

export default nextConfig;
