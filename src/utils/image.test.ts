import { downsizedUrl, parseImageUrl, variantUrl } from "./image";

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
