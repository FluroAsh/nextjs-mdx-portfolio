import { RecordField } from "@/components/record-field";
import { cn, zeroPad } from "@/utils/misc";

import {
  EXPERIENCES,
  ExperienceBody,
  TYPE_LABEL_EN,
  TYPE_LABEL_ZH,
  formatPeriod,
} from "./experiences";
import { RecordScale, groupBoundsFor, spacingAfter } from "./year-scale";

/** Split out from the section so a layout can place the records without also
 *  taking the section's heading and column width. */
export const TimelineRecords = ({ className }: { className?: string } = {}) => (
  <ol className={className}>
    {EXPERIENCES.map((experience, index) => {
      const isCurrent = experience.end === null;
      const spacing = spacingAfter(experience, EXPERIENCES[index + 1]);

      return (
        // This margin *is* the axis's inter-record run — changing it here
        // silently desyncs the records from the year scale.
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
              // `-mb` cancels the trailing letter-space vertical writing
              // modes add after the final glyph, so the column sits flush.
              className={cn(
                "mt-2 -mb-[0.25em] font-mono text-lg tracking-[0.25em] sm:text-xl",
                isCurrent ? "text-signal" : "text-green-400",
              )}
              style={{ writingMode: "vertical-rl" }}
            >
              {TYPE_LABEL_ZH[experience.type]}
            </span>

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
              {/* No font utility: the global heading rule is unlayered, so
                  overriding it here would need `!important`. */}
              <h3 className="text-lg font-bold text-neutral-50 sm:text-xl">
                {experience.title}
              </h3>

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

            <div className="mt-3 text-sm text-neutral-300">
              <ExperienceBody content={experience.content} />
            </div>
          </div>
        </li>
      );
    })}
  </ol>
);
