// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Image optimization configuration
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

export default nextConfig;