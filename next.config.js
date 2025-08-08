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
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: '34.212.24.109',
      },
    ],
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://34.212.24.109/:path*"
    }
  ]
}

module.exports = nextConfig 