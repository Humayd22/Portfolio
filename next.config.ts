import { fileURLToPath } from "node:url";
import path from "node:path";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: dirname,
  },
  images: {
    /*
     * Dev only. The optimizer caches a transformed image by URL, not by file
     * content — replacing public/images/foo.png with new bytes under the same
     * name keeps serving the old render (proven: swapped the bytes behind a
     * live file, re-requested the identical /_next/image URL, got back the
     * old file — X-Nextjs-Cache: HIT). Fine in production, where files don't
     * change under a live server; actively wrong during local iteration,
     * where "save and replace" is the whole workflow. Bypassing the optimizer
     * in dev makes the browser fetch the raw file directly, which revalidates
     * against the file's real on-disk Last-Modified/ETag on every load.
     */
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
