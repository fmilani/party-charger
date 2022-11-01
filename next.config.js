/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['s3.amazonaws.com', 'splitwise.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
