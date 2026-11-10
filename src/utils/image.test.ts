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
        folder: "japan-2025/kyoto",
        name: "kyoto-13",
        variant: "large",
      },
    ],
    [
      "a nested un-prefixed original",
      `${CDN}/content-store/buff-rick/buff-rick.webp`,
      {
        folder: "content-store",
        name: "buff-rick",
        variant: null,
      },
    ],
    [
      "a Strapi image migrated to a set folder under legacy",
      `${CDN}/legacy/DSC_1963_f6f8bf29c4/large_DSC_1963_f6f8bf29c4.webp`,
      {
        folder: "legacy",
        name: "DSC_1963_f6f8bf29c4",
        variant: "large",
      },
    ],
    [
      "a nested name that starts with a variant word",
      `${CDN}/large-prints/large_format/medium_large_format.webp`,
      {
        folder: "large-prints",
        name: "large_format",
        variant: "medium",
      },
    ],
    [
      "a nested original whose name starts with a variant word",
      `${CDN}/food/medium_rare/medium_rare.webp`,
      {
        folder: "food",
        name: "medium_rare",
        variant: null,
      },
    ],
  ])("parses %s", (_, url, expected) => {
    expect(parseImageUrl(url)).toMatchObject(expected);
  });

  it("parses the full-size variant", () => {
    expect(
      parseImageUrl(`${CDN}/content-store/buff-rick/full_buff-rick.webp`),
    ).toMatchObject({
      name: "buff-rick",
      variant: "full",
    });
  });

  it.each([
    ["a file outside any set folder", `${CDN}/legacy/large_DSC_2361.webp`],
    ["a file in /public", "/images/portrait.webp"],
    [
      "an image on another host",
      "https://media3.giphy.com/media/abc/giphy.gif",
    ],
  ])("returns null for %s", (_, url) => {
    expect(parseImageUrl(url)).toBeNull();
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
        parseImageUrl(`${CDN}/legacy/chestnut_cake/large_chestnut_cake.webp`)!,
        null,
      ),
    ).toBe(`${CDN}/legacy/chestnut_cake/chestnut_cake.webp`);
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
      `${CDN}/static/ash-warrnambool/ash-warrnambool.webp`,
      `${CDN}/static/ash-warrnambool/ash-warrnambool.webp`,
    ],
    [
      "leaves a file outside any set folder alone",
      `${CDN}/legacy/large_DSC_2361.webp`,
      `${CDN}/legacy/large_DSC_2361.webp`,
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

  it("labels the siblings of a nested portrait with their widths, not their longest edge", () => {
    expect(
      srcSetCandidates(`${KYOTO}/large_kyoto-13.webp`, measured(960, 1440)),
    ).toEqual([
      { url: `${KYOTO}/medium_kyoto-13.webp`, width: 533 },
      { url: `${KYOTO}/large_kyoto-13.webp`, width: 960 },
    ]);
  });

  it("lists an older width-sized portrait's own file once", () => {
    const large = `${CDN}/japan-2025/tokyo/tokyo-kura-2/large_tokyo-kura-2.webp`;
    expect(srcSetCandidates(large, measured(1440, 1920))).toEqual([
      {
        url: `${CDN}/japan-2025/tokyo/tokyo-kura-2/medium_tokyo-kura-2.webp`,
        width: 600,
      },
      { url: large, width: 1440 },
    ]);
  });

  it("stops at large for a nested full-size image, leaving it to the lightbox", () => {
    expect(
      srcSetCandidates(`${KYOTO}/full_kyoto-13.webp`, measured(2560, 3840)),
    ).toEqual([
      { url: `${KYOTO}/medium_kyoto-13.webp`, width: 533 },
      { url: `${KYOTO}/large_kyoto-13.webp`, width: 960 },
    ]);
  });

  it("offers set-folder widths, not Strapi ones, for a migrated legacy image", () => {
    const set = `${CDN}/legacy/DSC_1963_f6f8bf29c4`;
    expect(
      srcSetCandidates(
        `${set}/large_DSC_1963_f6f8bf29c4.webp`,
        measured(1440, 960),
      ),
    ).toEqual([
      { url: `${set}/medium_DSC_1963_f6f8bf29c4.webp`, width: 800 },
      { url: `${set}/large_DSC_1963_f6f8bf29c4.webp`, width: 1440 },
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

  it("offers no siblings for an image that is not in a set folder", () => {
    const gif =
      "https://media3.giphy.com/media/v1.abc/14cAD9mBjofP5m/giphy.gif";
    expect(srcSetCandidates(gif, measured(480, 270))).toEqual([
      { url: gif, width: 480 },
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
