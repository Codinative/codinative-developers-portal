import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-only packages; keep them out of the client/edge bundle.
  serverExternalPackages: ["firebase-admin", "nodemailer"],
};

export default nextConfig;
