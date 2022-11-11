/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async rewrites() {
    return [
      {
        destination: "https://nickname.hwanmoo.kr/:path*",
        source: "/nickname/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
