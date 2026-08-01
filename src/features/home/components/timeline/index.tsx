import { BilingualLabel } from "@/components/bilingual-label";
import { cn } from "@/utils/misc";

import { EXPERIENCES } from "./experiences";
import { TimelineRecords } from "./records";

const SECTION_MARKER = { zh: "記錄", en: "REC" } as const;

const RECORD_COUNT = EXPERIENCES.length;

/**
 * Each entry is a record rather than an article: labelled fields aligned to a
 * shared column, with only the description behaving as prose. Category and state
 * are separate dimensions, so they get separate slots — category in the gutter
 * with the record's identifying structure, state on the heading line with its
 * identity. Archived is the unmarked default; only the current role is called
 * out.
 *
 * Outer surface / chapter-break chrome is owned by the caller (or the chapter
 * break prototype) so the page can stagger bands without the records caring.
 */
export const TimelineSection = ({
  className,
}: {
  className?: string;
} = {}) => {
  return (
    <section className={cn("relative", className)}>
      {/*
        One composition: header and records share the same column and left edge
        (the year-scale rail's home). Centred as a unit per interim anchoring —
        not left-aligned to the wider frame like Toolchain.
      */}
      <div className="py-section mx-auto w-full max-w-3xl px-6 sm:pr-6 sm:pl-2">
        <div
          className={cn(
            "mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2",
            "border-b border-green-500/15 pb-3",
            "font-mono text-[10px] tracking-wider text-green-500/70 uppercase",
          )}
        >
          <span>{RECORD_COUNT} RECORDS · ENGINEERING SINCE 2022</span>
          <BilingualLabel {...SECTION_MARKER} />
        </div>

        <div>
          <h2 className="text-4xl font-bold tracking-tight text-neutral-50">
            Timeline
          </h2>
          <p className="max-w-measure mt-3 text-sm text-neutral-300 sm:text-base">
            Work, study, and one detour into competitive esports.
          </p>
        </div>

        <TimelineRecords className="mt-10" />
      </div>
    </section>
  );
};
