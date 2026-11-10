import {
  downsizedUrl,
  formatSrcSet,
  imageSizes,
  parseImageUrl,
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
