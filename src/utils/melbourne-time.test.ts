import {
  formatMelbourneClock,
  formatMelbourneDateTime,
} from "./melbourne-time";

/** Fixed UTC instants so assertions don't depend on the host timezone. */
const AEST_INSTANT = "2026-07-31T02:00:09.000Z"; // winter → Melbourne 12:00:09 AEST
const AEDT_INSTANT = "2026-01-15T02:05:30.000Z"; // summer → Melbourne 13:05:30 AEDT

describe("formatMelbourneClock", () => {
  it.each([
    [AEST_INSTANT, "winter", { zone: "AEST", clock: "12:00:09" }],
    [AEDT_INSTANT, "summer", { zone: "AEDT", clock: "13:05:30" }],
  ])("formats %s as Melbourne clock parts (%s)", (iso, _season, expected) => {
    expect(formatMelbourneClock(new Date(iso))).toEqual(expected);
  });
});

describe("formatMelbourneDateTime", () => {
  it.each([
    [AEST_INSTANT, "31.07.26 12:00"],
    [AEDT_INSTANT, "15.01.26 13:05"],
  ])("formats %s as %s", (iso, expected) => {
    expect(formatMelbourneDateTime(iso)).toBe(expected);
  });

  it("accepts a Date as well as an ISO string", () => {
    expect(formatMelbourneDateTime(new Date(AEST_INSTANT))).toBe(
      formatMelbourneDateTime(AEST_INSTANT),
    );
  });
});
