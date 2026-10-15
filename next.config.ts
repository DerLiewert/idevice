import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME as string;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
   experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};
export default nextConfig;
