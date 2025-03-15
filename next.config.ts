import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'sphmbocvwmutmvceihez.supabase.co',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' https://sphmbocvwmutmvceihez.supabase.co data:; sandbox;",
  },
  // Optimize font loading to prevent preloading warnings

  experimental: {


  },
};

export default nextConfig;
