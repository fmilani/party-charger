/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['s3.amazonaws.com', 'splitwise.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
