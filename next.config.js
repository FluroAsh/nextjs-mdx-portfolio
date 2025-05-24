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
  async rewrites() {
    return [
      {
        // TODO: Store images in a S3 bucket via a CloudFront distribution
        source: "/images/:path*",
        destination: "https://your-s3-bucket.s3.amazonaws.com/images/:path*",
      },
      {
        source: "/static/:path*",
        destination: "/static/:path*", // Serve static content from the local /static directory
      },
    ];
  },
};

export default withContentlayer(nextConfig);
