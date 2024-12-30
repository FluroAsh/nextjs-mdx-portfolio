import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withContentlayer(nextConfig);
