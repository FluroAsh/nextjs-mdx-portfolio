import { type Blog, type BlogSeries, allBlogSeries, allBlogs } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";

import {
  excludeDrafts,
  filterBySeries,
  sortByDateAsc,
  sortBySeriesOrderDesc,
} from "@/features/blog/utils";

/** Combined array of all blog posts and multi-part blog posts (series). */
export const allBlogContent: BlogContent[] = [
  ...allBlogs,
  ...allBlogSeries,
].filter(excludeDrafts);

// Type predicates to allow TypeScript to infer the type of the post correctly, derived from the BlogContent type
export const isBlogSeries = (post: BlogContent): post is BlogSeries => post.type === "BlogSeries";
export const isBlog = (post: BlogContent): post is Blog => post.type === "Blog";

/** All blog series posts, sorted by seriesOrder (newest first). */
export const allBlogSeriesPosts = allBlogContent
  .filter(isBlogSeries)
  .sort(sortBySeriesOrderDesc)

export const getSeriesPosts = (post: BlogSeries) => filterBySeries(allBlogSeriesPosts, post)

/** All blog posts (including mutli-part posts) excluding drafts, sorted by date in descending order (newest first). */
export const sortedPostsByDateDesc = allBlogContent.sort(sortByDateAsc);

/** All blog posts (including mutli-part posts) excluding drafts, sorted by date in ascending order (oldest first). */
export const sortedPostsByDateAsc = [...sortedPostsByDateDesc].reverse();
