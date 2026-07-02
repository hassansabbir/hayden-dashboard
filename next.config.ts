import type { NextConfig } from "next";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const parsedApi = new URL(apiBase);
const apiProto = parsedApi.protocol.replace(":", "") as "http" | "https";

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ["sabbir3001.naimulhassan.me", "sabbir3000.naimulhassan.me"],

  images: {
    unoptimized: true,
    remotePatterns: [
      // Cloudinary — required when MEDIA_PROVIDER=CLOUDINARY in production
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Production backend (resolved from NEXT_PUBLIC_API_URL at build time)
      {
        protocol: apiProto,
        hostname: parsedApi.hostname,
        ...(parsedApi.port ? { port: parsedApi.port } : {}),
        pathname: "/**",
      },
      // Local dev fallbacks
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/**" },
    ],
  },
};

export default nextConfig;
