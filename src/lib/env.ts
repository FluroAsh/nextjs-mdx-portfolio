export const env = {
  baseS3Origin: `${process.env.NEXT_PUBLIC_S3_HOSTNAME ? `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}` : ""}`,
  secondaryS3Origin: `${process.env.NEXT_PUBLIC_S3_HOSTNAME ? `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}` : ""}`,
};
