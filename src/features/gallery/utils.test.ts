import {
  exifFields,
  formatAspectRatio,
  formatExposure,
  formatGeo,
  formatTakenAt,
  frameNumber,
} from "./utils";

describe("formatTakenAt", () => {
  it.each([
    [
      "2025-03-14T21:42:00+09:00",
      { date: "2025-03-14", time: "21:42", zone: "UTC+09" },
    ],
    [
      "2025-03-14T21:42:00+05:30",
      { date: "2025-03-14", time: "21:42", zone: "UTC+05:30" },
    ],
    ["2025-03-14T21:42Z", { date: "2025-03-14", time: "21:42", zone: "UTC" }],
    ["2025-03-14T21:42:00", { date: "2025-03-14", time: "21:42", zone: null }],
  ])("keeps the local wall-clock time of %s", (input, expected) => {
    expect(formatTakenAt(input)).toEqual(expected);
  });

  it("returns null for a value it cannot read", () => {
    expect(formatTakenAt("14/03/2025")).toBeNull();
  });
});

describe("formatExposure", () => {
  it.each([
    [1 / 60, "1/60 S"],
    [0.004, "1/250 S"],
    [0.4, "0.4 S"],
    [2, "2 S"],
  ])("formats %f as %s", (seconds, expected) => {
    expect(formatExposure(seconds)).toBe(expected);
  });
});

describe("formatGeo", () => {
  it("names hemispheres instead of signs", () => {
    expect(formatGeo({ latitude: -37.8136, longitude: 144.9631 })).toBe(
      "37.8136°S 144.9631°E",
    );
  });
});

describe("exifFields", () => {
  it("leaves out what the file did not record", () => {
    expect(exifFields({ aperture: 2.8, iso: 1600 })).toEqual([
      { label: "APERTURE", value: "F/2.8" },
      { label: "ISO", value: "1600" },
    ]);
  });
});

describe("formatAspectRatio", () => {
  it.each([
    [6000, 4000, "3:2"],
    [1080, 1920, "9:16"],
    [1440, 1013, "1.42:1"],
  ])("formats %i×%i as %s", (w, h, expected) => {
    expect(formatAspectRatio(w, h)).toBe(expected);
  });
});

it("pads frame numbers to three digits", () => {
  expect(frameNumber(7)).toBe("007");
});
