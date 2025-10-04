/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        
      },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      // if using CloudFront:
      { protocol: 'https', hostname: 'd23es5hp06bfni.cloudfront.net' },
    ],
  },
};

module.exports = nextConfig;
