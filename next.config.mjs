/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
    ],
    domains: ['f4ace19bccf4e8dc4a42fe945c75b9c8.r2.cloudflarestorage.com']
  },
};

export default nextConfig;
