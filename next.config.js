/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cosmicjs.com',
      }
    ],
  },
  // Ensure typedRoutes is disabled to prevent complex TypeScript errors
  experimental: {
    typedRoutes: false,
  },
}

module.exports = nextConfig