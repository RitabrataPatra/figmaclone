import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liveblocks.io',
        port: '',
        // Add other required properties of ImageConfigComplete here
      } 
    ]
  }
  
};

export default nextConfig;