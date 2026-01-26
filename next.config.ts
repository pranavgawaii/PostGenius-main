import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  } as any,
};

export default nextConfig;
