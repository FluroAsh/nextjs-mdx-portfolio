import { cn, zeroPad } from "@/utils/misc";

import { BilingualLabel } from "../bilingual-label";
import {
  EXPERIENCES,
  ExperienceBody,
  TYPE_LABEL_EN,
  TYPE_LABEL_ZH,
  formatPeriod,
} from "./experiences";
import { RecordField } from "./record-field";
import { RecordScale, groupBoundsFor, spacingAfter } from "./year-scale";

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

        <ol className="mt-10">
          {EXPERIENCES.map((experience, index) => {
            const isCurrent = experience.end === null;
            const spacing = spacingAfter(experience, EXPERIENCES[index + 1]);

            return (
              // The gap below each row *is* the axis's inter-record run, so the
              // spacing between records and the axis stay in lockstep.
              <li
                key={experience.title}
                className="flex gap-4 sm:gap-6"
                style={{ marginBottom: spacing.height }}
              >
                <RecordScale
                  entry={experience}
                  spacing={spacing}
                  bounds={groupBoundsFor(index, EXPERIENCES)}
                  isCurrent={isCurrent}
                />

                {/* Category and record number: the identifying structure, so the
                    whole column carries the state accent together. Two sizes
                    only — the glyphs, and everything else — so the index and
                    the gloss read as the same tier either side of them. */}
                <div className="flex w-14 shrink-0 flex-col items-center sm:w-16">
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-wider tabular-nums",
                      isCurrent ? "text-signal/80" : "text-green-500/70",
                    )}
                  >
                    {zeroPad(index + 1)}
                  </span>

                  <span
                    // Trailing letter-space after the final glyph is a
                    // cross-engine quirk of vertical writing modes, cancelled
                    // below; the wider tracking is the breathing room vertical
                    // text needs that horizontal chrome doesn't.
                    //
                    // Bright step of the ramp, pairing with the dim gloss below
                    // it for hierarchy through shade rather than a second size.
                    className={cn(
                      "mt-2 -mb-[0.25em] font-mono text-lg tracking-[0.25em] sm:text-xl",
                      isCurrent ? "text-signal" : "text-green-400",
                    )}
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {TYPE_LABEL_ZH[experience.type]}
                  </span>

                  {/* Gloss for readers who don't read the glyphs above it — the
                      only carrier of category meaning for them, so it takes the
                      dim step of the ramp rather than a fade, and stays well
                      clear of the contrast floor at 6.2:1. */}
                  <span
                    className={cn(
                      "mt-2 text-center font-mono text-[10px] tracking-wider whitespace-nowrap",
                      isCurrent ? "text-signal-dim" : "text-green-600",
                    )}
                  >
                    {TYPE_LABEL_EN[experience.type]}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {/* Human voice, like the prose: the organisation is the
                        record's identity, not chrome. Inherits FiraSans from the
                        global heading rule, so no font utility — and therefore
                        none of the `!important` the unlayered global rule would
                        otherwise force. Hierarchy comes from size and weight. */}
                    <h3 className="text-lg font-bold text-neutral-50 sm:text-xl">
                      {experience.title}
                    </h3>

                    {/* Marked with the same bar the axis uses for the current
                        span, so the label is read as this component's own mark
                        rather than a generic badge. It stands apart from the
                        title without being tethered to it. */}
                    {isCurrent && (
                      <span className="text-signal flex items-center gap-1.5 font-mono text-[10px] tracking-wider">
                        <span
                          aria-hidden
                          className="bg-signal/70 h-3 w-0.5 rounded-full"
                        />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <dl className="mt-2 space-y-1">
                    <RecordField field="role" isCurrent={isCurrent}>
                      {experience.role}
                    </RecordField>

                    <RecordField field="period" isCurrent={isCurrent}>
                      {formatPeriod(experience)}
                    </RecordField>

                    <RecordField field="location" isCurrent={isCurrent}>
                      {experience.location}
                    </RecordField>
                  </dl>

                  {/* Body prose, same as the section intro — Catamaran is the
                      body face; Fira Sans is reserved for the heading above. */}
                  <div className="mt-3 text-sm text-neutral-300">
                    <ExperienceBody content={experience.content} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
