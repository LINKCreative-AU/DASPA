import { REDIRECTS } from "./redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return REDIRECTS;
  },
};

export default nextConfig;
