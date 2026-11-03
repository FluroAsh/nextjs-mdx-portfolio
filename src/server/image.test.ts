import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import { srcSetCandidates } from "@/utils/image";

import { lightboxSlide, measureImage } from "./image";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_S3_HOSTNAME = "images.example.com";
});
vi.mock("probe-image-size", () => ({ default: vi.fn() }));
vi.mock("plaiceholder", () => ({ getPlaiceholder: vi.fn() }));

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
  vi.mocked(probe).mockResolvedValue({ width: 1440, height: 960 } as never);
  vi.mocked(getPlaiceholder).mockResolvedValue({ base64: "probed" } as never);
});

describe("measureImage from a manifest", () => {
  it("reads a longest-edge portrait without downloading the image", async () => {
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

    const image = await measureImage(`${dir}/large_portrait.webp`);

    expect(fetchMock).toHaveBeenCalledWith(`${dir}/manifest.json`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(probe).not.toHaveBeenCalled();
    expect(image).toMatchObject({
      width: 960,
      height: 1440,
      measured: true,
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

    const image = await measureImage(`${CDN}/trip/old/large_old.webp`);

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

    const image = await measureImage(
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

    const image = await measureImage(`${CDN}/trip/mid/medium_mid.webp`);

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

    const image = await measureImage(`${CDN}/trip/tiny/large_tiny.webp`);

    expect(widths(image.candidates)).toEqual(["large_tiny.webp 400"]);
  });

  it("fetches a set's manifest once for several of its images", async () => {
    serve(
      manifest("trip", "shared", { medium: [800, 600], large: [1440, 1080] }),
    );

    await measureImage(`${CDN}/trip/shared/large_shared.webp`);
    await measureImage(`${CDN}/trip/shared/medium_shared.webp`);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("measureImage fallback", () => {
  const expectProbed = async (src: string) => {
    const image = await measureImage(src);

    expect(probe).toHaveBeenCalledWith(src);
    expect(image).toMatchObject({
      width: 1440,
      height: 960,
      measured: true,
      base64: "probed",
    });
    expect(image.candidates).toEqual(
      srcSetCandidates(src, { width: 1440, height: 960, measured: true }),
    );
  };

  it("probes an image its folder's manifest does not list", async () => {
    serve(manifest("trip", "loose", { large: [1440, 960] }));

    await expectProbed(`${CDN}/trip/loose/large_other.webp`);
  });

  it("probes an image whose manifest has an unknown schema", async () => {
    serve(manifest("trip", "future", { large: [1440, 960] }, 2));

    await expectProbed(`${CDN}/trip/future/large_future.webp`);
  });

  it("probes an image whose manifest has no variants", async () => {
    serve({ schema: 1, placeholder: BLUR });

    await expectProbed(`${CDN}/trip/empty/large_empty.webp`);
  });

  it("warns once with the URL of each probed image", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const src = `${CDN}/trip/bare/large_bare.webp`;
    fetchMock.mockImplementation(async () => new Response("", { status: 404 }));

    await measureImage(src);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(src));
  });

  it("retries a failed manifest fetch on the next call", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    serve(manifest("trip", "retry", { large: [1440, 960] }));

    await measureImage(`${CDN}/trip/retry/large_retry.webp`);
    const image = await measureImage(`${CDN}/trip/retry/large_retry.webp`);

    expect(probe).toHaveBeenCalledTimes(1);
    expect(image.width).toBe(1440);
  });

  it("probes an image whose set has no manifest", async () => {
    fetchMock.mockImplementation(async () => new Response("", { status: 403 }));

    await expectProbed(`${CDN}/trip/bare/large_bare.webp`);
  });

  it("probes an image on another host without looking for a manifest", async () => {
    const src = "https://elsewhere.example.com/a/b/large_b.webp";

    await measureImage(src);

    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("manifest.json"),
    );
    expect(probe).toHaveBeenCalledWith(src);
  });

  it("fails, naming the image, when the manifest fetch and the probe both fail", async () => {
    const src = `${CDN}/trip/broken/large_broken.webp`;
    fetchMock.mockRejectedValue(new Error("network down"));
    vi.mocked(probe).mockRejectedValue(new Error("probe down"));

    await expect(measureImage(src)).rejects.toThrow(src);
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

    expect(slide.src).toBe(`${CDN}/trip/wide/full_wide.webp?v=1`);
    expect(slide.srcSet?.map((s) => s.width)).toEqual([800, 1440, 3840]);
  });

  it("keeps the linked file when the set has no manifest", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 403 }));
    const src = `${CDN}/trip/none/large_none.webp`;

    expect(await lightboxSlide(src)).toEqual({ src });
  });
});
