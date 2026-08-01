import type { ReactNode } from "react";

export type ChapterMeta = { index: string };

export const CHAPTERS = {
  /** No 01: the marquee's ABOUT button already marks that seam. */
  toolchain: { index: "02" },
  timeline: { index: "03" },
} as const satisfies Record<string, ChapterMeta>;

export const CHAPTER_BAND = "bg-surface-section";

const ChapterRail = ({ chapter }: { chapter: ChapterMeta }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 z-30 flex -translate-y-1/2 items-center"
  >
    {/* min-w keeps a stub of rule left of the index once the frame fills the viewport. */}
    <div className="h-px min-w-3 flex-1 bg-green-500/25" />

    {/* Left padding only. A trailing pad opens a second gap at the frame's
        right edge, and the hole around the index is meant to be the one break. */}
    <div className="max-w-frame flex w-full items-center gap-3 pl-3 sm:gap-6 sm:pl-6">
      <span className="shrink-0 font-mono text-[10px] tracking-wider text-green-500/70 tabular-nums">
        {chapter.index}
      </span>

      <div className="h-px min-w-0 flex-1 bg-green-500/25" />
    </div>

    <div className="h-px min-w-0 flex-1 bg-green-500/25" />
  </div>
);

/** Wrapper keeps the rail outside section bodies that set `overflow-hidden`. */
export const ChapterWithRail = ({
  chapter,
  children,
}: {
  chapter: ChapterMeta;
  children: ReactNode;
}) => (
  <div className="relative">
    <ChapterRail chapter={chapter} />
    {children}
  </div>
);
