import { cn } from "@/utils/misc";

import { type Experience } from "./experiences";

/**
 * Breathing room between records before any elapsed time is added, so two
 * contiguous roles still read as separate rows.
 */
const GAP_BASE = 16;

/** Height given to each year elapsed between one role ending and the next starting. */
const GAP_PER_YEAR = 36;

/** Drawn at the bar's width so a gap reads as the same line, broken. */
const DOTTED_RUN =
  "repeating-linear-gradient(to bottom, currentColor 0 3px, transparent 3px 8px)";

/**
 * A piecewise time axis.
 *
 * A single linear scale can never line up with records whose heights are driven
 * by prose length — the two measure different things, and putting them in
 * adjacent columns invites a row-by-row comparison that always fails. Driving
 * the layout from a fixed pixel-per-year would fix alignment but force either
 * overflow on short roles with long descriptions or dead space everywhere else.
 *
 * So the axis is broken into two kinds of interval:
 *
 *   within a record — the bar spans exactly that card, top to bottom, so the
 *                     bounds align by construction with no measurement
 *   between records — a dotted run whose height *is* time-scaled, which turns
 *                     the spacing between cards from arbitrary padding into the
 *                     elapsed years it represents
 *
 * The consequence is that bar length no longer encodes duration, so the years
 * are stated at the extremes rather than implied by intervening ticks.
 */
export const spacingAfter = (
  entry: Experience,
  next: Experience | undefined,
) => {
  if (!next) return { height: 0, continuous: false };

  const elapsed = Math.max(entry.start - (next.end ?? entry.start), 0);

  return {
    height: GAP_BASE + elapsed * GAP_PER_YEAR,
    // Back-to-back roles share a boundary year, so the axis must stay solid
    // across the spacing between their cards. Dotting it there would assert a
    // break in the timeline that never happened.
    continuous: elapsed === 0,
  };
};

/**
 * Consecutive roles that share a boundary year form one unbroken span, so the
 * axis is only cut where a span actually starts or ends — not at every record.
 * Notching each record would assert a break mid-span: two back-to-back roles
 * read as 2021 → now, not as 2021 → 2022 and 2022 → now.
 */
export const groupBoundsFor = (index: number, entries: Experience[]) => {
  const previous = entries[index - 1];
  const next = entries[index + 1];

  return {
    startsSpan: !previous || !spacingAfter(previous, entries[index]).continuous,
    endsSpan: !next || !spacingAfter(entries[index], next).continuous,
    // Only the outermost bounds are labelled. Interior span years are already
    // stated in each record's period field, so repeating them on the axis adds
    // noise without adding information — and they land mid-run, where there is
    // no room to place them cleanly.
    isTimelineStart: index === 0,
    isTimelineEnd: index === entries.length - 1,
  };
};

type RecordScaleProps = {
  entry: Experience;
  /** The run below this record, from `spacingAfter`. */
  spacing: ReturnType<typeof spacingAfter>;
  /** Where the axis is cut, from `groupBoundsFor`. */
  bounds: ReturnType<typeof groupBoundsFor>;
  isCurrent: boolean;
};

export const RecordScale = ({
  entry,
  spacing,
  bounds,
  isCurrent,
}: RecordScaleProps) => {
  // Every mark on the record's own span follows its state, the same as the rest
  // of its chrome.
  const rail = isCurrent ? "bg-signal/30" : "bg-green-500/20";
  const bar = isCurrent ? "bg-signal/70" : "bg-green-500/55";
  const notch = isCurrent ? "bg-signal/60" : "bg-green-500/35";
  const label = isCurrent ? "text-signal/70" : "text-green-500/60";

  return (
    <div aria-hidden className="relative hidden w-10 shrink-0 sm:block">
      {bounds.isTimelineStart && (
        <span
          className={cn(
            "absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tabular-nums",
            label,
          )}
        >
          {entry.end ?? "NOW"}
        </span>
      )}

      {/* Faint rail behind the bar, so the axis still reads as one line. */}
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2",
          rail,
        )}
      />

      {/* The bar is the standout. It spans the card exactly — this element is a
          flex child, so it stretches to the row's content box and its bounds
          cannot drift from the content beside it. */}
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full",
          bar,
        )}
      />

      {/* Notches mark where a span begins and ends, not where records happen to
          be split. Two back-to-back roles are one span, so the boundary between
          them is left uncut. */}
      {bounds.startsSpan && (
        <span
          className={cn(
            "absolute top-0 left-1/2 h-px w-1.5 -translate-x-1/2",
            notch,
          )}
        />
      )}
      {bounds.endsSpan && (
        <span
          className={cn(
            "absolute bottom-0 left-1/2 h-px w-1.5 -translate-x-1/2",
            notch,
          )}
        />
      )}

      {/* One run, drawn solid or dotted. It belongs to neither record, so it
          always takes the neutral hue — which also lets the accent terminate
          exactly on the active record's bound. */}
      {spacing.height > 0 && (
        <span
          className={cn(
            "absolute top-full left-1/2 w-0.5 -translate-x-1/2",
            spacing.continuous
              ? "rounded-full bg-green-500/55"
              : "text-green-500/40",
          )}
          style={{
            height: spacing.height,
            backgroundImage: spacing.continuous ? undefined : DOTTED_RUN,
          }}
        />
      )}

      {bounds.isTimelineEnd && (
        <span
          className={cn(
            "absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tabular-nums",
            label,
          )}
        >
          {entry.start}
        </span>
      )}
    </div>
  );
};
