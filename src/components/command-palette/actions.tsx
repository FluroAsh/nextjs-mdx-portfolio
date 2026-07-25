import { LucideBookOpen, LucideCamera, LucideHome } from "lucide-react";

import { allBlogContent } from "@/data/content";
import { getCoreContent } from "@/lib/helpers";

/**
 * An entry in the palette. Actions are plain data — navigation is expressed as
 * an `href` rather than a callback, which keeps the lists below at module scope
 * instead of rebuilding them (and every closure in them) on each render.
 */
export type CommandAction = {
  id: string;
  name: string;
  href: string;
  subtitle?: string;
  shortcut?: string;
  keywords?: string[];
  icon?: React.ReactNode;
};

export const PAGE_ACTIONS: CommandAction[] = [
  {
    id: "home",
    name: "Home",
    href: "/",
    shortcut: "h",
    keywords: ["home", "root"],
    icon: <LucideHome />,
  },
  {
    id: "blog",
    name: "Blog",
    href: "/blog",
    shortcut: "b",
    subtitle: "Read my latest blog posts",
    keywords: ["blog"],
    icon: <LucideBookOpen />,
  },
  {
    id: "gallery",
    name: "Gallery",
    href: "/gallery",
    shortcut: "g",
    subtitle: "View photos from my latest adventures!",
    keywords: ["photos", "pictures", "gallery"],
    icon: <LucideCamera />,
  },
];

export const BLOG_ACTIONS: CommandAction[] = getCoreContent(allBlogContent).map(
  (post) => ({
    id: post.slug,
    name: post.title,
    href: post.url,
    subtitle: post.description,
    keywords: [post.description, ...post.tags],
    icon: <LucideBookOpen />,
  }),
);

export const COMMAND_ACTIONS = [...PAGE_ACTIONS, ...BLOG_ACTIONS];
