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
      {
        destination:
          "https://storage.googleapis.com/ai-technique-on-web.appspot.com/:path*",
        source: "/gcp-bucket/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
