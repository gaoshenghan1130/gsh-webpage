/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require("next-contentlayer2");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // ⚠️ Next 16 必须：显式禁用 Turbopack
  turbopack: {},

  trailingSlash: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  images: {
    unoptimized: process.env.UNOPTIMIZED === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' giscus.app analytics.umami.is;
              style-src 'self' 'unsafe-inline';
              img-src * blob: data:;
              media-src *;
              connect-src *;
              font-src 'self';
              frame-src giscus.app;
            `.replace(/\n/g, ""),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  webpack(config) {
    // SVG → React Component
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(withContentlayer(nextConfig));
