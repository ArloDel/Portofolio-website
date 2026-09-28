/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export target (Cloudflare Pages serves the `out/` folder directly)
  output: "export",
  images: {
    // next/image optimization endpoint requires a server — use unoptimized
    // sources with static export
    unoptimized: true,
  },
};

export default nextConfig;
