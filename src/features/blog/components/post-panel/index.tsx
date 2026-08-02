"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LucideChevronLeft } from "lucide-react";
import { motion as m, useScroll } from "motion/react";

import { BilingualLabel } from "@/components/bilingual-label";
import { paths } from "@/config/paths";
import { author } from "@/data/author";
import { isBlogSeries } from "@/data/content";
import { usePostContext } from "@/lib/contexts/post-context";
import { cn } from "@/utils/misc";

import { Readout } from "./block";
import { ContentsBlock } from "./contents";
import { NeighbourBlock, SeriesBlock } from "./series";

export const Byline = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <Image
      src="/static/images/ash-avatar.png"
      alt=""
      width={40}
      height={40}
      unoptimized
      className="size-10 border border-green-500/25 object-cover"
    />
    <div>
      <p className="font-mono text-[11px] tracking-wide text-neutral-200">
        {author.name}
      </p>
      <BilingualLabel zh="作者" en="AUTHOR" />
    </div>
  </div>
);

export const BackToIndex = ({ className }: { className?: string }) => (
  <Link
    href={paths.blog}
    className={cn("group inline-flex items-center gap-1.5", className)}
  >
    <LucideChevronLeft className="size-3.5 text-green-600 transition-colors duration-150 ease-linear group-hover:text-green-400" />
    <BilingualLabel zh="返回" en="INDEX" />
  </Link>
);

const useScrollPercent = () => {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  useEffect(
    () => scrollYProgress.on("change", (v) => setPercent(Math.round(v * 100))),
    [scrollYProgress],
  );

  return percent;
};

const PanelFoot = () => {
  const { scrollYProgress } = useScroll();
  const percent = useScrollPercent();

  return (
    <div className="relative shrink-0 border-t border-green-500/15">
      <m.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-green-400/70"
      />

      <div className="flex items-center justify-between p-4">
        <BackToIndex />
        <Readout>{String(percent).padStart(3, "0")}%</Readout>
      </div>
    </div>
  );
};

/** Capped to the viewport with only the contents list scrolling — the panel is
 *  sticky, so anything past the fold would be unreachable, not just off-screen. */
export const PostPanel = ({ className }: { className?: string }) => {
  const { post } = usePostContext();

  return (
    // No `flex` here — the caller sets the display class and `cn` drops a
    // base one as a conflict.
    <aside
      className={cn(
        "clip-chamfer max-h-[calc(100dvh-64px)] flex-col self-start bg-green-500/25 p-px",
        className,
      )}
    >
      <div
        className="clip-chamfer flex min-h-0 flex-1 flex-col"
        style={{
          /** Must stay opaque. `--surface-section` is translucent, so the border layer underneath would show through the whole panel, not just the 1px gap. */
          background: "color-mix(in oklab, white 3.5%, var(--surface-page))",
        }}
      >
        <div className="shrink-0 p-4">
          <Byline />
        </div>

        <ContentsBlock />

        <div className="shrink-0 overflow-y-auto">
          {isBlogSeries(post) ? <SeriesBlock /> : <NeighbourBlock />}
        </div>

        <PanelFoot />
      </div>
    </aside>
  );
};
