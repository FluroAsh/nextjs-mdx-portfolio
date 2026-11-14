import { isOnImageOrigin, lightboxSlide, requireManifest } from "./image";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_S3_HOSTNAME = "images.example.com";
});

const CDN = "https://images.example.com";
const BLUR = "data:image/webp;base64,AAAA";

const entry = (key: string, width: number, height: number) => ({
  key,
  format: "webp",
  width,
  height,
  bytes: 1,
  etag: '"x"',
});

/** Variants keyed by size name, each `[width, height]`. */
const manifest = (
  folder: string,
  name: string,
  sizes: Record<string, [number, number]>,
  schema: number = 1,
) => ({
  schema,
  name,
  folder,
  layout: "nested",
  status: "ready",
  createdAt: "2026-01-01T00:00:00.000Z",
  placeholder: BLUR,
  source: null,
  variants: Object.fromEntries(
    Object.entries(sizes).map(([size, [width, height]]) => [
      size,
      entry(`${folder}/${name}/${size}_${name}.webp`, width, height),
    ]),
  ),
});

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const serve = (body: unknown) =>
  fetchMock.mockImplementation(async () => new Response(JSON.stringify(body)));

const widths = (candidates: { url: string; width: number }[]) =>
  candidates.map(({ url, width }) => `${url.split("/").pop()} ${width}`);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requireManifest", () => {
  it("reads a longest-edge portrait from the manifest alone", async () => {
    const dir = `${CDN}/trip/portrait`;
    serve(
      manifest("trip", "portrait", {
        thumbnail: [80, 120],
        small: [267, 400],
        medium: [533, 800],
        large: [960, 1440],
        full: [2560, 3840],
      }),
    );

    const image = await requireManifest(`${dir}/large_portrait.webp`);

    expect(fetchMock).toHaveBeenCalledWith(`${dir}/manifest.json`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(image).toMatchObject({
      width: 960,
      height: 1440,
      base64: BLUR,
      orientation: "portrait",
    });
    expect(widths(image.candidates)).toEqual([
      "small_portrait.webp 267",
      "medium_portrait.webp 533",
      "large_portrait.webp 960",
    ]);
  });

  it("uses the real widths of an older width-sized portrait", async () => {
    serve(
      manifest("trip", "old", {
        thumbnail: [120, 160],
        medium: [800, 1067],
        large: [1440, 1920],
      }),
    );

    const image = await requireManifest(`${CDN}/trip/old/large_old.webp`);

    expect(image).toMatchObject({ width: 1440, height: 1920 });
    expect(widths(image.candidates)).toEqual([
      "medium_old.webp 800",
      "large_old.webp 1440",
    ]);
  });

  it("stops at the widest inline size when a set has no large", async () => {
    serve(
      manifest("trip", "small-set", {
        small: [400, 300],
        medium: [800, 600],
        full: [1200, 900],
      }),
    );

    const image = await requireManifest(
      `${CDN}/trip/small-set/full_small-set.webp`,
    );

    expect(image).toMatchObject({ width: 1200, height: 900 });
    expect(widths(image.candidates)).toEqual([
      "small_small-set.webp 400",
      "medium_small-set.webp 800",
    ]);
  });

  it("offers nothing wider than the image's own inline size", async () => {
    serve(
      manifest("trip", "mid", {
        small: [400, 300],
        medium: [800, 600],
        large: [1440, 1080],
      }),
    );

    const image = await requireManifest(`${CDN}/trip/mid/medium_mid.webp`);

    expect(widths(image.candidates)).toEqual([
      "small_mid.webp 400",
      "medium_mid.webp 800",
    ]);
  });

  it("lists one file per width when a small source made equal sizes", async () => {
    serve(
      manifest("trip", "tiny", {
        small: [400, 300],
        medium: [400, 300],
        large: [400, 300],
      }),
    );

    const image = await requireManifest(`${CDN}/trip/tiny/large_tiny.webp`);

    expect(widths(image.candidates)).toEqual(["large_tiny.webp 400"]);
  });

  it("fetches a set's manifest once for several of its images", async () => {
    serve(
      manifest("trip", "shared", { medium: [800, 600], large: [1440, 1080] }),
    );

    await requireManifest(`${CDN}/trip/shared/large_shared.webp`);
    await requireManifest(`${CDN}/trip/shared/medium_shared.webp`);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("requireManifest failures", () => {
  it.each([
    [
      "an image its folder's manifest does not list",
      () => serve(manifest("trip", "loose", { large: [1440, 960] })),
      `${CDN}/trip/loose/large_other.webp`,
    ],
    [
      "a manifest with an unknown schema",
      () => serve(manifest("trip", "future", { large: [1440, 960] }, 2)),
      `${CDN}/trip/future/large_future.webp`,
    ],
    [
      "a manifest with no variants",
      () => serve({ schema: 1, placeholder: BLUR }),
      `${CDN}/trip/empty/large_empty.webp`,
    ],
    [
      "a set with no manifest",
      () =>
        fetchMock.mockImplementation(
          async () => new Response("", { status: 403 }),
        ),
      `${CDN}/trip/bare/large_bare.webp`,
    ],
    [
      "a manifest fetch that fails",
      () => fetchMock.mockRejectedValue(new Error("network down")),
      `${CDN}/trip/broken/large_broken.webp`,
    ],
  ])("fails, naming the image, for %s", async (_, arrange, src) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    arrange();

    await expect(requireManifest(src)).rejects.toThrow(src);
  });

  it("retries a failed manifest fetch on the next call", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    serve(manifest("trip", "retry", { large: [1440, 960] }));

    await expect(
      requireManifest(`${CDN}/trip/retry/large_retry.webp`),
    ).rejects.toThrow();
    const image = await requireManifest(`${CDN}/trip/retry/large_retry.webp`);

    expect(image.width).toBe(1440);
  });
});

describe("isOnImageOrigin", () => {
  it("is true for the CDN host and false for any other", () => {
    expect(isOnImageOrigin(`${CDN}/a/b/large_b.webp`)).toBe(true);
    expect(isOnImageOrigin("https://elsewhere.example.com/a.gif")).toBe(false);
  });
});

describe("lightboxSlide", () => {
  it("offers every real size and links the largest", async () => {
    serve(
      manifest("trip", "wide", {
        placeholder: [20, 13],
        thumbnail: [120, 80],
        medium: [800, 533],
        large: [1440, 960],
        full: [3840, 2560],
      }),
    );
    const slide = await lightboxSlide(`${CDN}/trip/wide/large_wide.webp?v=1`);

    expect(slide).toEqual({
      src: `${CDN}/trip/wide/full_wide.webp?v=1`,
      srcSet: [
        `${CDN}/trip/wide/medium_wide.webp?v=1 800w`,
        `${CDN}/trip/wide/large_wide.webp?v=1 1440w`,
        `${CDN}/trip/wide/full_wide.webp?v=1 3840w`,
      ].join(", "),
      width: 3840,
      height: 2560,
      placeholder: BLUR,
    });
  });

  it("keeps the linked file when the set has no manifest", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 403 }));
    const src = `${CDN}/trip/none/large_none.webp`;

    expect(await lightboxSlide(src)).toEqual({ src });
  });
});
