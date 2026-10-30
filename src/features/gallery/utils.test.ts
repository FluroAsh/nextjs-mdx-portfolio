import {
  distributeColumns,
  exifFields,
  formatAspectRatio,
  formatExposure,
  formatGeo,
  formatTakenAt,
  frameNumber,
} from "./utils";

const landscape = (id: number) => ({ id, width: 3, height: 2 });
const portrait = (id: number) => ({ id, width: 2, height: 3 });

describe("distributeColumns", () => {
  it("fills columns left to right while heights are equal", () => {
    const columns = distributeColumns([1, 2, 3].map(landscape), 3);
    expect(columns.map((c) => c.map((i) => i.id))).toEqual([[1], [2], [3]]);
  });

  it("places each item in the shortest column", () => {
    const columns = distributeColumns(
      [portrait(1), landscape(2), landscape(3)],
      2,
    );
    expect(columns.map((c) => c.map((i) => i.id))).toEqual([[1], [2, 3]]);
  });

  it("keeps earlier placements when more items are appended", () => {
    const first = [portrait(1), landscape(2), landscape(3), portrait(4)];
    const before = distributeColumns(first, 3);
    const after = distributeColumns([...first, landscape(5)], 3);

    before.forEach((column, i) =>
      expect(after[i].slice(0, column.length)).toEqual(column),
    );
  });
});

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
