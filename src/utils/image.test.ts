import {
  downsizedUrl,
  formatSrcSet,
  imageSizes,
  parseImageUrl,
  srcSetCandidates,
  variantUrl,
} from "./image";

const CDN = "https://images.ashmatrix.com";

describe("parseImageUrl", () => {
  it.each([
    [
      "a nested variant",
      `${CDN}/japan-2025/kyoto/kyoto-13/large_kyoto-13.webp`,
      {
        layout: "nested",
        folder: "japan-2025/kyoto",
        name: "kyoto-13",
        variant: "large",
      },
    ],
    [
      "a nested un-prefixed original",
      `${CDN}/content-store/buff-rick/buff-rick.webp`,
      {
        layout: "nested",
        folder: "content-store",
        name: "buff-rick",
        variant: null,
      },
    ],
    [
      "a flat variant",
      `${CDN}/legacy/large_DSC_2361_Enhanced_NR_34e9ea1944.webp`,
      {
        layout: "flat",
        folder: "legacy",
        name: "DSC_2361_Enhanced_NR_34e9ea1944",
        variant: "large",
      },
    ],
    [
      "a flat un-prefixed original",
      `${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`,
      {
        layout: "flat",
        folder: "legacy",
        name: "DSC_1963_f6f8bf29c4",
        variant: null,
      },
    ],
    [
      "a nested name that starts with a variant word",
      `${CDN}/large-prints/large_format/medium_large_format.webp`,
      {
        layout: "nested",
        folder: "large-prints",
        name: "large_format",
        variant: "medium",
      },
    ],
    [
      "a nested original whose name starts with a variant word",
      `${CDN}/food/medium_rare/medium_rare.webp`,
      { layout: "nested", folder: "food", name: "medium_rare", variant: null },
    ],
    [
      "a flat name that contains a variant word",
      `${CDN}/legacy/enlarged_small_cake_bb45ff3720.webp`,
      {
        layout: "flat",
        folder: "legacy",
        name: "enlarged_small_cake_bb45ff3720",
        variant: null,
      },
    ],
  ])("parses %s", (_, url, expected) => {
    expect(parseImageUrl(url)).toMatchObject(expected);
  });

  it("parses the lossless variant the upload service now writes", () => {
    expect(
      parseImageUrl(`${CDN}/content-store/buff-rick/lossless_buff-rick.webp`),
    ).toMatchObject({
      layout: "nested",
      name: "buff-rick",
      variant: "lossless",
    });
  });

  it("returns null for something that is not an image URL", () => {
    expect(parseImageUrl("not a url")).toBeNull();
  });
});

describe("variantUrl", () => {
  it.each([
    [
      "nested",
      `${CDN}/japan-2025/kyoto/kyoto-13/large_kyoto-13.webp`,
      `${CDN}/japan-2025/kyoto/kyoto-13/medium_kyoto-13.webp`,
    ],
    [
      "flat",
      `${CDN}/legacy/large_DSC_2361_Enhanced_NR_34e9ea1944.webp`,
      `${CDN}/legacy/medium_DSC_2361_Enhanced_NR_34e9ea1944.webp`,
    ],
    [
      "flat un-prefixed original",
      `${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`,
      `${CDN}/legacy/medium_DSC_1963_f6f8bf29c4.webp`,
    ],
    [
      "folder and name containing `large`",
      `${CDN}/large-prints/large-shrine/large_large-shrine.webp`,
      `${CDN}/large-prints/large-shrine/medium_large-shrine.webp`,
    ],
  ])("builds the medium sibling of a %s image", (_, url, expected) => {
    expect(variantUrl(parseImageUrl(url)!, "medium")).toBe(expected);
  });

  it("builds the un-prefixed original", () => {
    expect(
      variantUrl(
        parseImageUrl(`${CDN}/legacy/large_chestnut_cake_bb45ff3720.webp`)!,
        null,
      ),
    ).toBe(`${CDN}/legacy/chestnut_cake_bb45ff3720.webp`);
  });
});

describe("downsizedUrl", () => {
  it.each([
    [
      "swaps a large variant for its medium sibling",
      `${CDN}/static/ash-warrnambool/large_ash-warrnambool.webp`,
      `${CDN}/static/ash-warrnambool/medium_ash-warrnambool.webp`,
    ],
    [
      "leaves an un-prefixed original alone",
      `${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`,
      `${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`,
    ],
    [
      "leaves an original in a folder named `large` alone",
      `${CDN}/large/enlarged_cake_bb45ff3720.webp`,
      `${CDN}/large/enlarged_cake_bb45ff3720.webp`,
    ],
    [
      "leaves an already medium variant alone",
      `${CDN}/japan-2025/kyoto/kyoto-13/medium_kyoto-13.webp`,
      `${CDN}/japan-2025/kyoto/kyoto-13/medium_kyoto-13.webp`,
    ],
    ["leaves an unparseable source alone", "not a url", "not a url"],
    [
      "leaves a path without a leading slash alone",
      "img/large_x.webp",
      "img/large_x.webp",
    ],
    [
      "keeps a query string",
      `${CDN}/a/b/large_b.webp?download`,
      `${CDN}/a/b/medium_b.webp?download`,
    ],
    [
      "keeps a hash",
      `${CDN}/a/b/large_b.webp#top`,
      `${CDN}/a/b/medium_b.webp#top`,
    ],
    [
      "keeps a query string and hash",
      `${CDN}/a/b/large_b.webp?w=1&x=2#top`,
      `${CDN}/a/b/medium_b.webp?w=1&x=2#top`,
    ],
  ])("%s", (_, url, expected) => {
    expect(downsizedUrl(url)).toBe(expected);
  });
});

describe("srcSetCandidates", () => {
  const KYOTO = `${CDN}/japan-2025/kyoto/kyoto-13`;
  const measured = (width: number, height: number) => ({
    width,
    height,
    measured: true,
  });

  it("offers the medium sibling of a nested large image", () => {
    expect(
      srcSetCandidates(`${KYOTO}/large_kyoto-13.webp`, measured(1440, 1080)),
    ).toEqual([
      { url: `${KYOTO}/medium_kyoto-13.webp`, width: 800 },
      { url: `${KYOTO}/large_kyoto-13.webp`, width: 1440 },
    ]);
  });

  it("drops a nested sibling that is no narrower than the image itself", () => {
    const large = `${CDN}/content-store/buff-rick/large_buff-rick.webp`;
    expect(srcSetCandidates(large, measured(800, 450))).toEqual([
      { url: large, width: 800 },
    ]);
  });

  it("offers nothing wider than the image that was asked for", () => {
    const medium = `${KYOTO}/medium_kyoto-13.webp`;
    expect(srcSetCandidates(medium, measured(800, 600))).toEqual([
      { url: medium, width: 800 },
    ]);
  });

  it("ends a flat landscape original with the original at its probed width", () => {
    const original = `${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`;
    expect(srcSetCandidates(original, measured(2160, 1440))).toEqual([
      { url: `${CDN}/legacy/small_DSC_1963_f6f8bf29c4.webp`, width: 500 },
      { url: `${CDN}/legacy/medium_DSC_1963_f6f8bf29c4.webp`, width: 750 },
      { url: `${CDN}/legacy/large_DSC_1963_f6f8bf29c4.webp`, width: 1000 },
      { url: original, width: 2160 },
    ]);
  });

  it("labels the siblings of a flat portrait with their widths, not their longest edge", () => {
    const original = `${CDN}/legacy/friendship_garden_pce_b4f7d9fd16.webp`;
    expect(srcSetCandidates(original, measured(1080, 1620))).toEqual([
      {
        url: `${CDN}/legacy/small_friendship_garden_pce_b4f7d9fd16.webp`,
        width: 333,
      },
      {
        url: `${CDN}/legacy/medium_friendship_garden_pce_b4f7d9fd16.webp`,
        width: 500,
      },
      {
        url: `${CDN}/legacy/large_friendship_garden_pce_b4f7d9fd16.webp`,
        width: 667,
      },
      { url: original, width: 1080 },
    ]);
  });

  it("does not repeat a width when a flat original is as wide as its large sibling", () => {
    const original = `${CDN}/legacy/square_0a1b2c3d4e.webp`;
    const widths = srcSetCandidates(original, measured(1000, 667)).map(
      (candidate) => candidate.width,
    );
    expect(widths).toEqual([500, 750, 1000]);
  });

  it("does not add the original for a flat variant, whose original width is unknown", () => {
    const large = `${CDN}/legacy/large_DSC_1963_f6f8bf29c4.webp`;
    expect(srcSetCandidates(large, measured(1000, 667))).toEqual([
      { url: `${CDN}/legacy/small_DSC_1963_f6f8bf29c4.webp`, width: 500 },
      { url: `${CDN}/legacy/medium_DSC_1963_f6f8bf29c4.webp`, width: 750 },
      { url: large, width: 1000 },
    ]);
  });

  it("offers no siblings for a flat image outside the legacy folder", () => {
    const gif =
      "https://media3.giphy.com/media/v1.abc/14cAD9mBjofP5m/giphy.gif";
    expect(srcSetCandidates(gif, measured(480, 270))).toEqual([
      { url: gif, width: 480 },
    ]);
  });

  it("offers a flat original that is smaller than every sibling size", () => {
    const original = `${CDN}/legacy/tiny_icon_0a1b2c3d4e.webp`;
    expect(srcSetCandidates(original, measured(400, 300))).toEqual([
      { url: original, width: 400 },
    ]);
  });

  it("offers nothing when the size was not measured", () => {
    expect(
      srcSetCandidates(`${CDN}/legacy/DSC_1963_f6f8bf29c4.webp`, {
        width: 1200,
        height: 800,
        measured: false,
      }),
    ).toEqual([]);
  });
});

describe("formatSrcSet", () => {
  it("joins candidates as url and width descriptors", () => {
    expect(
      formatSrcSet([
        { url: "/a.webp", width: 500 },
        { url: "/b.webp", width: 750 },
      ]),
    ).toBe("/a.webp 500w, /b.webp 750w");
  });

  it("is empty for no candidates", () => {
    expect(formatSrcSet([])).toBe("");
  });
});

describe("imageSizes", () => {
  it("follows the article column: 48px of gutters, a 296px panel from 900px, a 1024px frame", () => {
    expect(imageSizes(false)).toBe(
      "(min-width: 1024px) 680px, (min-width: 900px) calc(100vw - 344px), calc(100vw - 48px)",
    );
  });

  it("is the fixed 400px column for portrait and square images, until the viewport is narrower", () => {
    expect(imageSizes(true)).toBe(
      "(min-width: 448px) 400px, calc(100vw - 48px)",
    );
  });
});
