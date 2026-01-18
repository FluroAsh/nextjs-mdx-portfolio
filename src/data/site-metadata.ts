import { author } from "./author";

export const siteMetaData = {
  title: author.name,
  description: `A digital portfolio showcasing ${author.name}'s work, projects, travels & photography.`,
  siteUrl: "https://www.ashleygthompson.com",
  siteRepo: "https://github.com/fluroash/nextjs-mdx-portfolio",
  siteLogo: "/static/images/ash-avatar.png",
  image: "/static/images/ash-avatar.png",
  socialBanner:
    "https://images.ashmatrix.com/legacy/static-assets/og-image.png",
  email: author.email,
  github: author.socials.Github.href,
  x: author.socials.X.href,
  linkedin: author.socials.LinkedIn.href,
  instagram: author.socials.Instagram.href,
  locale: "en-AU",
} as const;

export type Networks = keyof typeof NETWORKS;

export const NETWORKS = {
  X: "X",
  LinkedIn: "LinkedIn",
  Instagram: "Instagram",
  GitHub: "GitHub",
};
