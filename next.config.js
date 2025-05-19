// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-domain.com'],
  },
  env: {
    API_URL: process.env.BASE_URL_API,
    PUBLIC_SRC: process.env.PUBLIC_SRC
  },
};

module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   basePath: process.env.BASE_PATH,
//   env: {
//     API_URL: process.env.BASE_URL_API,
//     PUBLIC_SRC: process.env.PUBLIC_SRC
//   },
//   // output: 'export', // Uncomment if you're using static export
// };

// module.exports = nextConfig;