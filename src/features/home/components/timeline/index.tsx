import { BilingualLabel } from "@/components/bilingual-label";
import { cn } from "@/utils/misc";

import { EXPERIENCES } from "./experiences";
import { TimelineRecords } from "./records";

const SECTION_MARKER = { zh: "記錄", en: "REC" } as const;

const RECORD_COUNT = EXPERIENCES.length;

/** Owns no surface, width, or spacing — the chapter places it, which is what
 *  lets the writing column sit beside it inside one frame. */
export const TimelineSection = ({
  className,
}: {
  className?: string;
} = {}) => (
  <section className={cn("min-w-0", className)}>
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2",
        "border-b border-green-500/15 pb-3",
        "font-mono text-[10px] tracking-wider text-green-500/70 uppercase",
      )}
    >
      <span>{RECORD_COUNT} RECORDS · ENGINEERING SINCE 2022</span>
      <BilingualLabel {...SECTION_MARKER} />
    </div>

    <div className="mt-6">
      <h2 className="text-4xl font-bold tracking-tight text-neutral-50">
        Timeline
      </h2>
      <p className="max-w-measure mt-3 text-sm text-neutral-300 sm:text-base">
        Work, study, and one detour into competitive esports.
      </p>
    </div>

    <TimelineRecords className="mt-10" />
  </section>
);
