import Link from "next/link";

import { type BlogContent } from "contentlayer/utils";
import { ArrowRight } from "lucide-react";

import { BilingualLabel } from "@/components/bilingual-label";
import { RecordField } from "@/components/record-field";
import { paths } from "@/config/paths";
import { type BilingualPair } from "@/data/identity";
import { cn, zeroPad } from "@/utils/misc";

import { readMinutes, shortDate, topicFor } from "../utils";
import { PostBackdrop, TileBrackets } from "./post-backdrop";

const MARKER: BilingualPair = { zh: "日誌", en: "LOG" };
const SERIES_LABEL: BilingualPair = { zh: "系列", en: "SERIES" };

const INTRO = "Written when there's something worth writing down.";

const TagList = ({ tags }: { tags: string[] }) => (
  <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
    {tags.map((tag) => (
      <li
        key={tag}
        className="border border-green-500/25 px-1.5 py-px font-mono text-[10px] tracking-wider text-neutral-300 uppercase transition-colors duration-150 ease-linear group-hover:border-green-400/50"
      >
        {tag}
      </li>
    ))}
  </ul>
);

/**
 * One tile, two densities. Folded, the column is 272–320px and prose would land
 * near 40 characters, so the tile carries identity and coordinates only.
 * Stacked, it has the full frame and takes the field table and excerpt too.
 */
const PostTile = ({ post, index }: { post: BlogContent; index: number }) => {
  const topic = topicFor(post.tags);

  return (
    <li
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden",
        "min-h-72 p-4",
        "fold:min-h-32 fold:p-3",
      )}
    >
      <PostBackdrop post={post} />
      <TileBrackets />

      <div className="flex items-baseline gap-2 font-mono text-[10px] tracking-wider">
        <span className="text-green-500/70 tabular-nums transition-colors duration-150 ease-linear group-hover:text-green-300">
          {zeroPad(index + 1)}
        </span>

        {/* Plain, not bilingual: glyphs label the system's own vocabulary, and
            a tag is author-written content. */}
        {topic && (
          <span className="text-green-600 group-hover:text-green-500">
            {topic}
          </span>
        )}

        {/* Folded only — stacked, the field table names the series in full. */}
        {post.type === "BlogSeries" && (
          <BilingualLabel
            {...SERIES_LABEL}
            className="fold:inline ml-auto hidden"
          />
        )}
      </div>

      {/* One link covering the tile, with the title as its accessible name. */}
      <h3 className="fold:text-base mt-1.5 text-lg font-bold text-balance text-neutral-50">
        <Link
          href={post.url}
          className="transition-colors duration-150 ease-linear group-hover:text-green-300 after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h3>

      <div className="fold:flex mt-1 hidden items-baseline gap-x-2 font-mono text-[10px] tracking-wider text-neutral-300 tabular-nums">
        <span>{shortDate(post.date)}</span>
        <span className="text-green-500/40">·</span>
        <span>{readMinutes(post)} MIN</span>
      </div>

      <div className="fold:hidden">
        <dl className="mt-2 space-y-1">
          <RecordField field="date">{shortDate(post.date)}</RecordField>

          {post.type === "BlogSeries" && (
            <RecordField field="series">
              {post.seriesTitle} · {post.seriesOrder}
            </RecordField>
          )}

          <RecordField field="read">{readMinutes(post)} MIN</RecordField>

          <RecordField field="tags">
            <TagList tags={post.tags} />
          </RecordField>
        </dl>

        <p className="max-w-measure mt-3 line-clamp-3 text-sm text-neutral-300">
          {post.description}
        </p>
      </div>
    </li>
  );
};

/**
 * The writing column. Owns no surface or spacing of its own, so the same
 * component serves the folded sidebar and the stacked mobile section.
 */
export const RecentPosts = ({ posts }: { posts: BlogContent[] }) => (
  <section className="fold:sticky fold:top-8 min-w-0 self-start">
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2",
        "border-b border-green-500/15 pb-3",
        "font-mono text-[10px] tracking-wider text-green-500/70 uppercase",
      )}
    >
      <span>
        {posts.length} POSTS · LATEST {shortDate(posts[0].date)}
      </span>
      <BilingualLabel {...MARKER} />
    </div>

    {/* Subordinate when folded, a section in its own right when stacked. */}
    <h2 className="fold:text-2xl mt-6 text-4xl font-bold tracking-tight text-neutral-50">
      Writing
    </h2>

    <p className="max-w-measure fold:hidden mt-3 text-sm text-neutral-300 sm:text-base">
      {INTRO}
    </p>

    <ol className="fold:space-y-3 mt-4 space-y-4">
      {posts.map((post, index) => (
        <PostTile key={post._id} post={post} index={index} />
      ))}
    </ol>

    <Link
      href={paths.blog.pathname}
      className="mt-4 flex items-center justify-between border-t border-green-500/15 pt-4 font-mono text-[10px] tracking-wider text-green-500/70 uppercase hover:text-green-300"
    >
      <BilingualLabel zh="全部" en="ALL POSTS" />
      <ArrowRight aria-hidden className="size-3.5" />
    </Link>
  </section>
);
