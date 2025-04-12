import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hisxtgeirxvxlbpczvpb.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; img-src 'self' https://hisxtgeirxvxlbpczvpb.supabase.co data:; sandbox;",
  },
  // Optimize font loading to prevent preloading warnings

  experimental: {},
};

export default nextConfig;
