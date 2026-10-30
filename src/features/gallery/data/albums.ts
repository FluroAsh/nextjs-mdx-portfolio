import type { GalleryAlbum } from "../types";

/** Display order of the filter row. */
export const ALBUMS: GalleryAlbum[] = [
  {
    slug: "tokyo",
    title: "Tokyo",
    postPath: "/blog/japan-2025/tokyo",
    series: "Japan 2025",
  },
  {
    slug: "kamakura",
    title: "Kamakura",
    // Day four of the Tokyo post; Kamakura has no post of its own.
    postPath: "/blog/japan-2025/tokyo#kamakura",
    series: "Japan 2025",
  },
  {
    slug: "china-2024",
    title: "China 2024",
    postPath: "/blog/china-2024",
  },
];
