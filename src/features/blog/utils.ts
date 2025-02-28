import { type Blog } from "contentlayer/generated";
import { slug } from "github-slugger";

/**
 * Filter out posts based on a `tag` parameter.
 * Only posts with a matching tag, and is *not* a draft will be returned.
 * */
export const filterByTag = (post: Blog, tag: string) => {
  return !post.draft && post.tags.map((t) => slug(t)).includes(tag);
};

/** Returns true if post is not marked `draft`. */
export const filterByDraft = (post: Blog) => !post.draft;

export const sortByDate = (a: Blog, b: Blog) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
