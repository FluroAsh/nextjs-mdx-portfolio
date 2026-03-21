/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME,
      },
    ],
  },
  // Dev only: keep compiled page entries in memory longer (default is ~15s). Matches the old
  // `withContentlayer` default so heavy content imports are less aggressively evicted when idle.
  onDemandEntries: { maxInactiveAge: 60 * 60 * 1000 },
};

export default nextConfig;
