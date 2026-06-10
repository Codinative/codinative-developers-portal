import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin is a server-only package; keep it out of the client bundle.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
