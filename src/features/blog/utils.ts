import { BlogSeries } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";

/**
 * Filter out posts based on a `tag` parameter.
 * Only posts with a matching tag, and is *not* a draft will be returned.
 * */
export const filterByTag = (post: BlogContent, tag: string) =>
  !post.draft && post.tags.map((t) => slug(t)).includes(tag);

/**
 * Filter all series posts by the given series slug, returning only posts
 * that are part of a given series, sorted by `seriesOrder` in descending order (1 -> n).
 */
export const filterBySeries = (allSeries: BlogSeries[], post: BlogSeries) =>
  allSeries
    .filter((s) => s.series === post.series)
    .sort((a, b) => a.seriesOrder - b.seriesOrder);

/** Returns true if post is not marked `draft`. */
export const excludeDrafts = (post: BlogContent) =>
  process.env.NODE_ENV === "production" ? !post.draft : true;

/** Sorts posts by date in asending order (oldest first). */
export const sortByDateAsc = (a: BlogContent, b: BlogContent) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** Sorts posts by date in descending order (newest first). */
export const sortBySeriesOrderDesc = (a: BlogSeries, b: BlogSeries) => a.seriesOrder - b.seriesOrder;
