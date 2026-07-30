import { MELBOURNE } from "@/data/identity";

/** Shared Melbourne `Intl` options. Callers add the fields they need. */
const melbourne = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-AU", {
    timeZone: MELBOURNE.timeZone,
    hour12: false,
    ...options,
  });

/** Live readout: `AEST 14:05:09` / `AEDT …` via formatToParts. */
export const melbourneClock = melbourne({
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
});

/** Deploy stamp: date + time, no zone label. */
export const melbourneDateTime = melbourne({
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const part = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) => parts.find((candidate) => candidate.type === type)?.value ?? "";

/** `{ zone: "AEST", clock: "14:05:09" }` for the live TIME row. */
export const formatMelbourneClock = (date: Date) => {
  const parts = melbourneClock.formatToParts(date);
  return {
    zone: part(parts, "timeZoneName"),
    clock: `${part(parts, "hour")}:${part(parts, "minute")}:${part(parts, "second")}`,
  };
};

/** `31.07.26 14:05` — UTC ISO or Date in, Melbourne local out. */
export const formatMelbourneDateTime = (date: Date | string) => {
  const parts = melbourneDateTime.formatToParts(new Date(date));
  return `${part(parts, "day")}.${part(parts, "month")}.${part(parts, "year")} ${part(parts, "hour")}:${part(parts, "minute")}`;
};
