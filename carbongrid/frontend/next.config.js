/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://neogreen-7321.onrender.com/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;