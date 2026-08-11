import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite optimizar las fotos servidas desde el storage público de Supabase
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
