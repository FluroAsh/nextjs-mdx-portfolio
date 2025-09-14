import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";

/**
 * Filter out posts based on a `tag` parameter.
 * Only posts with a matching tag, and is *not* a draft will be returned.
 * */
export const filterByTag = (post: BlogContent, tag: string) =>
  !post.draft && post.tags.map((t) => slug(t)).includes(tag);

/** Returns true if post is not marked `draft`. */
export const excludeDrafts = (post: BlogContent) =>
  process.env.NODE_ENV === "production" ? !post.draft : true;

/** Sorts posts by date in asending order (oldest first). */
export const sortByDateAsc = (a: BlogContent, b: BlogContent) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** Sorts posts by date in descending order (newest first). */
export const sortBySeriesOrderDesc = (a: BlogContent, b: BlogContent) => {
  if (a.type === "BlogSeries" && b.type === "BlogSeries") {
    return a.seriesOrder - b.seriesOrder;
  }
  return 0;
};
