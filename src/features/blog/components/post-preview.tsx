"use client";

import Image from "next/image";
import Link from "next/link";

import { type BlogSeries } from "contentlayer/generated";
import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";
import { motion as m } from "motion/react";

import { BilingualLabel } from "@/components/bilingual-label";
import { paths } from "@/config/paths";
import { cn, toRomanNumeral } from "@/utils/misc";

import { cardImage, readMinutes, shortDate } from "../utils";
import { item } from "./post-list";

const isSeries = (post: BlogContent): post is BlogSeries =>
  post.type === "BlogSeries";

const Thumbnail = ({ src }: { src: string }) => (
  <div className="relative hidden h-full w-36 overflow-hidden border border-green-500/20 md:block">
    {/* Cross-faded copies: animating the filter instead re-rasterises the downscaled bitmap every frame and crawls. */}
    <Image
      src={src}
      alt=""
      fill
      sizes="144px"
      className="object-cover brightness-[0.6] grayscale-100"
      unoptimized // Pre-sized CDN variant
    />

    <Image
      src={src}
      alt=""
      fill
      sizes="144px"
      aria-hidden
      className={cn(
        "object-cover brightness-90 grayscale-[0.55]",
        "opacity-0 transition-opacity duration-150 ease-linear group-hover:opacity-100",
        "motion-reduce:transition-none",
      )}
      unoptimized
    />

    <div
      aria-hidden
      className="absolute inset-0 bg-green-400/10 mix-blend-color transition-opacity duration-150 ease-linear group-hover:opacity-70 motion-reduce:transition-none"
    />
  </div>
);

const TagChips = ({ tags }: { tags: string[] }) => (
  <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
    {tags.map((tag) => (
      <li key={tag}>
        <Link
          href={paths.tag.getPathname(slug(tag))}
          className="relative z-10 block border border-green-500/25 px-1.5 py-px font-mono text-[10px] tracking-wider text-neutral-300 uppercase transition-colors duration-150 ease-linear hover:border-green-400/60 hover:text-green-300"
        >
          {tag}
        </Link>
      </li>
    ))}
  </ul>
);

export const PostPreview = ({ post }: { post: BlogContent }) => (
  <m.article
    variants={item}
    className={cn(
      "group relative grid gap-x-4 border-b border-green-500/10 py-5 last:border-b-0",
      "md:grid-cols-[9rem_minmax(0,1fr)]",
    )}
  >
    <Thumbnail src={cardImage(post.image)} />

    <div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[10px] tracking-wider uppercase">
        <span className="text-green-500/70 tabular-nums">
          {shortDate(post.date)}
        </span>
        <span className="text-green-500/40">·</span>
        <span className="text-neutral-400 tabular-nums">
          {readMinutes(post)} MIN
        </span>

        {isSeries(post) && (
          <span className="ml-auto flex items-baseline gap-1.5">
            <BilingualLabel zh="系列" en="SERIES" />
            <span className="text-green-500/70">
              {toRomanNumeral(post.seriesOrder)}
            </span>
          </span>
        )}
      </div>

      {/* `after` covers the row, so the card is clickable via one real link. */}
      <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-50">
        <Link
          href={post.url}
          className="transition-colors duration-150 ease-linear group-hover:text-green-300 after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h3>

      <p className="max-w-measure mt-2 line-clamp-2 text-sm text-neutral-300">
        {post.description}
      </p>

      <TagChips tags={post.tags} />
    </div>
  </m.article>
);
