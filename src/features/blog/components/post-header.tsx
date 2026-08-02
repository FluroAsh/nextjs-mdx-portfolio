"use client";

import Image from "next/image";

import { type BlogSeries } from "contentlayer/generated";

import { BilingualLabel } from "@/components/bilingual-label";
import { ScanlinePlane } from "@/components/scanline-plane";
import { usePostContext } from "@/lib/contexts/post-context";
import { formatDate } from "@/utils/dates";
import { toRomanNumeral } from "@/utils/misc";

import { readMinutes } from "../utils";
import { BackToIndex } from "./post-panel";
import { TagChips } from "./tag-chips";

const MetaSeparator = () => (
  <span aria-hidden className="h-2.5 w-px self-center bg-green-500/30" />
);

const Plate = () => {
  const { post } = usePostContext();

  return (
    <div className="relative hidden aspect-square w-full border border-green-500/25 sm:block">
      <Image
        src={post.image}
        alt=""
        fill
        sizes="(width <= 1024px) 40vw, 256px"
        priority
        unoptimized
        className="object-cover"
      />
    </div>
  );
};

export const PostHeader = () => {
  const { post } = usePostContext();
  const series = post.type === "BlogSeries" ? (post as BlogSeries) : null;

  return (
    // `isolate` contains the scanline/content layering. Without it they compete
    // in the root stacking context and paint over the fixed nav.
    <header className="bg-surface-section relative isolate overflow-hidden border-b border-green-500/20">
      <ScanlinePlane />

      <div className="max-w-frame relative z-30 mx-auto px-6 py-8">
        {/* The only way back to the listing below `fold`, where the panel is
            hidden. */}
        <BackToIndex className="fold:hidden mb-5" />

        {/* Same track and gap as the body grid — changing it here silently breaks the alignment with the panel and article below. */}
        <div className="grid gap-x-10 gap-y-5 sm:grid-cols-[176px_minmax(0,1fr)] lg:grid-cols-[256px_minmax(0,1fr)]">
          <Plate />

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] tracking-wider uppercase">
              <span className="text-green-500/80 tabular-nums">
                {formatDate(post.date)}
              </span>
              <MetaSeparator />
              <span className="text-neutral-400 tabular-nums">
                {readMinutes(post)} MIN
              </span>

              {series && (
                <>
                  <MetaSeparator />
                  <span className="flex items-baseline gap-1.5">
                    <BilingualLabel zh="系列" en="SERIES" />
                    <span className="text-green-500/80">
                      {toRomanNumeral(series.seriesOrder)}
                    </span>
                  </span>
                </>
              )}
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-neutral-50 sm:text-4xl">
              {post.title}
            </h1>

            <p className="max-w-measure mt-2 text-sm text-neutral-300">
              {post.description}
            </p>

            <TagChips tags={post.tags} className="mt-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
