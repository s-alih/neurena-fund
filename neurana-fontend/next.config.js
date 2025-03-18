/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  transpilePackages: [
    "@injectivelabs/sdk-ts",
    "@injectivelabs/utils",
    "@injectivelabs/networks",
    "@injectivelabs/wallet-ts",
  ],
};

module.exports = nextConfig;
