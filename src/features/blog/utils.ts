import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";

/**
 * Filter out posts based on a `tag` parameter.
 * Only posts with a matching tag, and is *not* a draft will be returned.
 * */
export const filterByTag = (post: BlogContent, tag: string) => {
  return !post.draft && post.tags.map((t) => slug(t)).includes(tag);
};

/** Returns true if post is not marked `draft`. */
export const excludeDrafts = (post: BlogContent) => !post.draft;

/** Sorts posts by date in descending order (newest first). */
export const sortByDateDesc = (a: BlogContent, b: BlogContent) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
