"use client";

import { useEffect, useState } from "react";

import { motion as m } from "motion/react";

import { MELBOURNE } from "@/data/identity";
import { cn } from "@/utils/misc";

import { ENTER } from "../../utils";
import { BilingualLabel } from "../bilingual-label";

/**
 * Background readouts, placed diagonally opposite the photo. One busy corner
 * and one empty one is what makes the empty space look intentional.
 *
 * Every value is real rather than made up. Hidden from screen readers — the
 * only useful fact here is repeated as a field in About.
 */

const TIME_FORMAT = new Intl.DateTimeFormat("en-AU", {
  timeZone: MELBOURNE.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

/** Reads the parts rather than one formatted string, so the timezone stays
 *  correct on its own: `AEST` in winter, `AEDT` in daylight saving. */
const formatMelbourneTime = (date: Date) => {
  const parts = TIME_FORMAT.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  return {
    zone: part("timeZoneName"),
    clock: `${part("hour")}:${part("minute")}:${part("second")}`,
  };
};

const formatCoordinate = (value: number) => value.toFixed(4);

/** Split out so each tick re-renders one line instead of the whole hero. Both
 *  values stay null until mount so the server and client markup match. */
const LiveReadouts = () => {
  const [time, setTime] = useState<ReturnType<
    typeof formatMelbourneTime
  > | null>(null);
  const [viewport, setViewport] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatMelbourneTime(new Date()));
    tick();

    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const measure = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <Row zh="時間" en="TIME" value={time && `${time.zone} ${time.clock}`} />
      {/* Hidden below `sm`: widest row, least useful value. */}
      <Row
        className="hidden sm:grid"
        zh="視窗"
        en="VIEW"
        value={viewport && `${viewport.width}×${viewport.height}`}
      />
    </>
  );
};

const Row = ({
  zh,
  en,
  value,
  className,
}: {
  zh: string;
  en: string;
  value: string | null;
  className?: string;
}) => (
  <div
    className={cn(
      "grid grid-cols-[2.75rem_1fr] gap-x-3 sm:grid-cols-[3.5rem_1fr]",
      className,
    )}
  >
    <BilingualLabel zh={zh} en={en} />
    {/* One shade brighter than the label beside it, which is what makes the
        values easy to scan. A solid colour rather than a faded one — opacity
        washes the colour out as well as darkening it. */}
    <span className="text-green-500 tabular-nums">{value ?? "—"}</span>
  </div>
);

export const ReadoutCluster = () => (
  <m.div
    aria-hidden
    className="pointer-events-none absolute top-0 right-0 left-0 z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ...ENTER, delay: 0.27 }}
  >
    <div className="max-w-frame mx-auto flex w-full px-6 pt-8">
      {/* Sits under a single line rather than in a box: a border plus padding
          would push the text off the left edge everything else lines up with. */}
      <div
        className={cn(
          "flex w-fit flex-col gap-1 pt-2",
          "border-t border-green-500/25",
          "font-mono text-[10px] tracking-wider",
        )}
      >
        <Row
          zh="座標"
          en="GEO"
          value={`${formatCoordinate(MELBOURNE.latitude)}, ${formatCoordinate(MELBOURNE.longitude)}`}
        />
        <LiveReadouts />
      </div>
    </div>
  </m.div>
);
