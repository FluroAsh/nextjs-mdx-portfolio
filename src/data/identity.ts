/** A label written in both scripts. Both halves are always shown together. */
export type BilingualPair = { zh: string; en: string };

/** The shared field vocabulary. */
export const FIELD_LABELS = {
  role: { zh: "職務", en: "ROLE" },
  location: { zh: "地點", en: "LOC" },
  period: { zh: "期間", en: "PERIOD" },
  org: { zh: "機構", en: "ORG" },
  focus: { zh: "專注", en: "FOCUS" },
  date: { zh: "日期", en: "DATE" },
  tags: { zh: "標籤", en: "TAGS" },
  read: { zh: "閱讀", en: "READ" },
  series: { zh: "系列", en: "SERIES" },
} as const satisfies Record<string, BilingualPair>;

export type FieldKey = keyof typeof FIELD_LABELS;

/** Section marker. 檔案 — "file / dossier". */
export const ABOUT_MARKER: BilingualPair = { zh: "檔案", en: "ABOUT" };

export const ABOUT_ANCHOR_ID = "about";

export const HERO_NAME_LABEL: BilingualPair = { zh: "姓名", en: "NAME" };

/** Short uppercase values — never a sentence. */
export const HERO_FIELDS = [
  { ...FIELD_LABELS.role, value: "FRONTEND ENGINEER" },
  { ...FIELD_LABELS.location, value: "MELBOURNE AU" },
] as const;

/** Markers for the two marquee segments. */
export const LATEST_MARKER: BilingualPair = { zh: "最新", en: "LATEST" };
export const SYSTEM_MARKER: BilingualPair = { zh: "系統", en: "SYSTEM" };

/** Only what the hero does not already state. */
export const ABOUT_FIELDS = [
  { ...FIELD_LABELS.org, value: "Myer" },
  { ...FIELD_LABELS.period, value: "Since 2022" },
  { ...FIELD_LABELS.focus, value: "React · Next.js" },
] as const;

export const ABOUT_HEADING = "Hey. I'm Ash";

export const ABOUT_PROSE = [
  "I came into engineering through a full-stack bootcamp and a Business Information Systems degree. That combination shaped how I work — I start from what a change is meant to achieve, not what it gets built with.",
  "For the past four years I've been a frontend engineer on one of Australia's largest e-commerce platforms, mostly in React and TypeScript. I've shipped features across legacy and modern architectures, and the experimentation work taught me to pay attention to what success actually looks like once something's live. That business background means I'm thinking about outcomes while I'm writing the code — not just whether it works, but whether it mattered.",
] as const;

/** Melbourne CBD (Bourke Street Mall). Real coordinates for the same place the
 *  background image shows and the `LOC` field names. */
export const MELBOURNE = {
  latitude: -37.8136,
  longitude: 144.9631,
  timeZone: "Australia/Melbourne",
} as const;

/** Plain strings only: importing the post index into a client component would
 *  send every post to the browser just to show three titles. */
export type LatestPost = {
  title: string;
  /** Pre-formatted; date-fns stays on the server. */
  date: string;
  url: string;
};

export type SystemStatus = {
  commitSubject: string;
  /** Pre-formatted deploy timestamp. */
  deployedAt: string;
  buildId: string;
};
