import { withContentlayer } from "next-contentlayer2";

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
};

export default withContentlayer(nextConfig);
