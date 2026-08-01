import { BlogSeries } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";

import { formatDate } from "@/utils/dates";

/**
 * Filter out posts based on a `tag` parameter.
 *
 * Drafts go through `excludeDrafts` rather than a hard `!post.draft`, or the
 * tag pages disagree with both `/blog` and the sidebar counts in development.
 */
export const filterByTag = (post: BlogContent, tag: string) =>
  excludeDrafts(post) && post.tags.map((t) => slug(t)).includes(tag);

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
export const sortBySeriesOrderDesc = (a: BlogSeries, b: BlogSeries) =>
  a.seriesOrder - b.seriesOrder;

/** The lead tag stands for the post's topic; the rest are detail. */
export const topicFor = (tags: readonly string[]) =>
  tags[0]?.toUpperCase() ?? null;

/** Fixed-width, so a column of dates stays a column. */
export const shortDate = (date: string) => formatDate(date, "dd.MM.yy");

/** `readingTime` comes through Contentlayer as untyped JSON. */
export const readMinutes = (post: BlogContent) =>
  Math.max(1, Math.round((post.readingTime as { minutes: number }).minutes));

/** The CDN has no resizing API, only pre-generated variants, and `medium_` is
 *  the one present on every asset — `small_` and `thumbnail_` are not. */
export const cardImage = (url: string) =>
  url.replace(/\/large_([^/]+)$/, "/medium_$1");
