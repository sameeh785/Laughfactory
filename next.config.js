/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.laughfactory.com',
      },
      {
        protocol: 'https',
        hostname: 'devsrepublic.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: '34.212.24.109',
      },{
        protocol: 'http',
        hostname: 'cdn.laughfactory.com',
      }
    ],
  },
}

module.exports = nextConfig 