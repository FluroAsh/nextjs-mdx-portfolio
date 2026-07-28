import { execSync } from "node:child_process";

/** Empty if it can't be resolved — the readout shows a dash, never a made-up
 *  value. */
const resolveBuildId = () => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }

  try {
    return execSync("git rev-parse --short=7 HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
};

/** First line only: Vercel gives us the whole commit message, body included. */
const resolveCommitSubject = () => {
  const fromCi = process.env.VERCEL_GIT_COMMIT_MESSAGE;
  if (fromCi) return fromCi.split("\n")[0].trim();

  try {
    return execSync("git log -1 --pretty=%s", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: resolveBuildId(),
    NEXT_PUBLIC_COMMIT_SUBJECT: resolveCommitSubject(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(), // Deliberately frozen at build time — it is the deploy timestamp
  },
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
