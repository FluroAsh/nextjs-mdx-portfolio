import { allBlogSeries, allBlogs } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";

import {
  excludeDrafts,
  sortByDateAsc,
  sortBySeriesOrderDesc,
} from "@/features/blog/utils";

/** Combined array of all blog posts and multi-part blog posts (series). */
export const allBlogContent: BlogContent[] = [
  ...allBlogs,
  ...allBlogSeries,
].filter(excludeDrafts);

/** All blog series posts, sorted by seriesOrder (newest first). */
export const seriesPosts = allBlogContent
  .filter((p) => p.type === "BlogSeries")
  .sort(sortBySeriesOrderDesc);

/** All blog posts (including mutli-part posts) excluding drafts, sorted by date in descending order (newest first). */
export const sortedPostsByDateDesc = allBlogContent.sort(sortByDateAsc);

/** All blog posts (including mutli-part posts) excluding drafts, sorted by date in ascending order (oldest first). */
export const sortedPostsByDateAsc = [...sortedPostsByDateDesc].reverse();
