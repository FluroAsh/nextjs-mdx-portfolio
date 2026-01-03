export const env = {
  imageOrigin: process.env.NEXT_PUBLIC_S3_HOSTNAME
    ? `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}`
    : "",
};
