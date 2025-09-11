import { excludeDrafts, sortByDateDesc } from "@/features/blog/utils";
import { allBlogs, allBlogSeries } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";

/** Combined array of all blog posts and multi-part blog posts (series). */
export const allBlogContent: BlogContent[] = [...allBlogs, ...allBlogSeries];

/** All blog posts (including mutli-part posts) excluding drafts. */
export const sortedPostsByDate = allBlogContent
  .filter(excludeDrafts)
  .sort(sortByDateDesc);
