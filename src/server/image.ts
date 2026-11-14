import { env } from "@/lib/env";
import {
  type SrcSetCandidate,
  formatSrcSet,
  getFileNameFromUrl,
} from "@/utils/image";

type Orientation = "landscape" | "portrait" | "square";

const calculateOrientation = (width: number, height: number): Orientation => {
  if (width > height) return "landscape";
  return height > width ? "portrait" : "square";
};

/** One stored file of an image set, as its manifest records it. */
type ManifestVariant = {
  /** Object key; its last path segment is the file name in the set folder. */
  key: string;
  /** Width in pixels. */
  width: number;
  /** Height in pixels. */
  height: number;
};

/** The fields the site reads from a set's `manifest.json` (upload service schema 1). */
type Manifest = {
  /** Any value other than `1` is treated as no manifest. */
  schema: number;
  /** Base64 data URI of a 20px blurred copy; `null` when the set has none. */
  placeholder: string | null;
  /** Files of the set keyed by size name; older sets may use names outside the size table. */
  variants: Record<string, ManifestVariant>;
};

/** Narrowest first; `large` is the inline ceiling, and `thumbnail`, `placeholder` and `full` are never inline. */
const INLINE_SIZES = ["small", "medium", "large"] as const;

/** A manifest fetch that failed, as opposed to a set that has none. */
const FETCH_FAILED = Symbol("manifest fetch failed");

/** Per process, so a set linked by several images or posts is fetched once a build. */
const manifests = new Map<
  string,
  Promise<Manifest | null | typeof FETCH_FAILED>
>();

const fetchManifest = async (url: string) => {
  try {
    const res = await fetch(url);
    if (res.status === 403 || res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest: Manifest = await res.json();
    return manifest.schema === 1 && manifest.variants ? manifest : null;
  } catch (error) {
    console.error(`Manifest fetch failed: ${url}`, error);
    return FETCH_FAILED;
  }
};

type ImageMeasurement = {
  /** Intrinsic width in pixels. */
  width: number;
  /** Intrinsic height in pixels. */
  height: number;
  /** Base64 blur placeholder; `""` when there is none. */
  base64: string;
  /** Shape of the image. */
  orientation: Orientation;
  /** Files the `srcset` offers, narrowest first. */
  candidates: SrcSetCandidate[];
};

/** A loose image beside a set folder of the same name must not take that set's sizes. */
const findOwnVariant = (src: URL, variants: ManifestVariant[]) => {
  const ownFile = getFileNameFromUrl(src.pathname);
  return variants.find((v) => getFileNameFromUrl(v.key) === ownFile);
};

const siblingUrl = (src: URL, { key }: ManifestVariant) => {
  const url = new URL(getFileNameFromUrl(key), src);
  url.search = src.search;
  url.hash = src.hash;
  return url.href;
};

const fromManifest = (
  src: URL,
  { placeholder, variants }: Manifest,
): ImageMeasurement | null => {
  const own = findOwnVariant(src, Object.values(variants));
  if (!own) return null;

  const inline = INLINE_SIZES.flatMap((size) => variants[size] ?? []);
  const ownIndex = inline.indexOf(own);
  /** Nothing wider than the linked file, so a caller that downsized gets nothing larger back. */
  const offered =
    ownIndex === -1
      ? inline.filter((v) => v.width <= own.width)
      : inline.slice(0, ownIndex + 1);
  /** A source smaller than a bound is stored at its own size, so sizes can share a width; the last of each run is kept. */
  const unique = offered.filter((v, i) => offered[i + 1]?.width !== v.width);

  const toCandidate = (v: ManifestVariant) => ({
    url: v === own ? src.href : siblingUrl(src, v),
    width: v.width,
  });

  return {
    width: own.width,
    height: own.height,
    base64: placeholder ?? "",
    orientation: calculateOrientation(own.width, own.height),
    candidates: (unique.length ? unique : [own]).map(toCandidate),
  };
};

/** Only images on our CDN host have manifests. */
export const isOnImageOrigin = (imageSrc: string) =>
  !!env.imageOrigin && imageSrc.startsWith(`${env.imageOrigin}/`);

const loadManifest = async (imageSrc: string) => {
  if (!isOnImageOrigin(imageSrc)) return null;

  const src = new URL(imageSrc);
  const manifestUrl = new URL("manifest.json", src).href;
  if (!manifests.has(manifestUrl))
    manifests.set(manifestUrl, fetchManifest(manifestUrl));

  const manifest = await manifests.get(manifestUrl);
  if (manifest === FETCH_FAILED) {
    /** Not cached, so the next image of the set retries. */
    manifests.delete(manifestUrl);
    return FETCH_FAILED;
  }
  return manifest && { src, manifest };
};

/** The measurement from the set's manifest; throws when there is none, so a caller never ships a guess. */
export const requireManifest = async (src: string) => {
  const loaded = await loadManifest(src);
  const measurement =
    loaded && loaded !== FETCH_FAILED
      ? fromManifest(loaded.src, loaded.manifest)
      : null;
  if (!measurement) throw new Error(`Set has no usable manifest: ${src}`);
  return measurement;
};

/** Never lightbox sizes: the placeholder is a 20px blur and the thumbnail a 120px grid size. */
const NON_LIGHTBOX_SIZES = ["placeholder", "thumbnail"];

/** An image as the lightbox takes it. */
type LightboxSource = {
  /** Largest file of the set. */
  src: string;
  /** Every real size of the set, as a `srcset` value. */
  srcSet?: string;
  /** Intrinsic width of `src` in pixels. */
  width?: number;
  /** Intrinsic height of `src` in pixels. */
  height?: number;
  /** Base64 blur of the set. */
  placeholder?: string;
};

/** The lightbox slide for an image; a set with no manifest keeps the linked file and nothing else. */
export const lightboxSlide = async (
  imageSrc: string,
): Promise<LightboxSource> => {
  const loaded = await loadManifest(imageSrc);
  if (!loaded || loaded === FETCH_FAILED) return { src: imageSrc };

  const { src, manifest } = loaded;
  const variants = Object.entries(manifest.variants);
  if (
    !findOwnVariant(
      src,
      variants.map(([, v]) => v),
    )
  )
    return { src: imageSrc };

  const sources = variants
    .filter(([size]) => !NON_LIGHTBOX_SIZES.includes(size))
    .map(([, v]) => ({
      url: siblingUrl(src, v),
      width: v.width,
      height: v.height,
    }))
    .sort((a, b) => a.width - b.width)
    /** A source smaller than a bound is stored at its own size, so sizes can share a width; the last of each run is kept. */
    .filter((v, i, all) => all[i + 1]?.width !== v.width);

  const largest = sources.at(-1);
  return largest
    ? {
        src: largest.url,
        srcSet: formatSrcSet(sources),
        width: largest.width,
        height: largest.height,
        placeholder: manifest.placeholder ?? undefined,
      }
    : { src: imageSrc };
};
