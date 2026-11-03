import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import { env } from "@/lib/env";
import {
  type ProbedSize,
  type SrcSetCandidate,
  getFileNameFromUrl,
  srcSetCandidates,
} from "@/utils/image";

type Orientation = "landscape" | "portrait" | "square";

const calculateOrientation = (
  width: number,
  height: number,
): Orientation | undefined => {
  switch (true) {
    case width > height:
      return "landscape";
    case height > width:
      return "portrait";
    case height === width:
      return "square";
    default:
      return undefined;
  }
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
export const FETCH_FAILED = Symbol("manifest fetch failed");

/** Per process, so a set linked by several images or posts is fetched once a build. */
const manifests = new Map<
  string,
  Promise<Manifest | null | typeof FETCH_FAILED>
>();

const fetchManifest = async (url: string) => {
  try {
    const res = await fetch(url);
    // The CDN answers 403 for a missing key, which is a set with no manifest yet.
    if (res.status === 403 || res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest: Manifest = await res.json();
    // A manifest without variants cannot answer for any image, so the probe does.
    return manifest.schema === 1 && manifest.variants ? manifest : null;
  } catch (error) {
    console.error(`Manifest fetch failed: ${url}`, error);
    return FETCH_FAILED;
  }
};

type ImageMeasurement = ProbedSize & {
  /** Base64 blur placeholder; `""` when there is none. */
  base64: string;
  /** Shape of the image; `undefined` only for non-numeric sizes. */
  orientation: Orientation | undefined;
  /** Files the `srcset` offers, narrowest first; empty when the size is a stand-in. */
  candidates: SrcSetCandidate[];
};

const fromManifest = (
  src: URL,
  { placeholder, variants }: Manifest,
): ImageMeasurement | null => {
  const ownFile = getFileNameFromUrl(src.pathname);
  const own = Object.values(variants).find(
    (v) => getFileNameFromUrl(v.key) === ownFile,
  );
  // A loose image beside a set folder of the same name must not take that set's sizes.
  if (!own) return null;

  const inline = INLINE_SIZES.flatMap((size) => variants[size] ?? []);
  const ownIndex = inline.indexOf(own);
  // Nothing wider than the linked file, so a caller that downsized gets nothing larger back.
  const offered =
    ownIndex === -1
      ? inline.filter((v) => v.width <= own.width)
      : inline.slice(0, ownIndex + 1);
  // A source smaller than a bound is stored at its own size, so sizes can share a width;
  // the last of each run is kept, which is the linked file when it is in the run.
  const unique = offered.filter((v, i) => offered[i + 1]?.width !== v.width);

  const toCandidate = (v: ManifestVariant) => {
    if (v === own) return { url: src.href, width: v.width };
    const url = new URL(getFileNameFromUrl(v.key), src);
    url.search = src.search;
    url.hash = src.hash;
    return { url: url.href, width: v.width };
  };

  return {
    width: own.width,
    height: own.height,
    measured: true,
    base64: placeholder ?? "",
    orientation: calculateOrientation(own.width, own.height),
    candidates: (unique.length ? unique : [own]).map(toCandidate),
  };
};

export const readManifest = async (imageSrc: string) => {
  if (!env.imageOrigin || !imageSrc.startsWith(`${env.imageOrigin}/`))
    return null;

  const src = new URL(imageSrc);
  const manifestUrl = new URL("manifest.json", src).href;
  if (!manifests.has(manifestUrl))
    manifests.set(manifestUrl, fetchManifest(manifestUrl));

  const manifest = await manifests.get(manifestUrl);
  if (manifest === FETCH_FAILED) {
    // Not cached, so the next image of the set retries.
    manifests.delete(manifestUrl);
    return FETCH_FAILED;
  }
  return manifest && fromManifest(src, manifest);
};

const probeImage = async (imageSrc: string) => {
  const { width, height } = await probe(imageSrc);
  const res = await fetch(imageSrc);
  const { base64 } = await getPlaiceholder(
    Buffer.from(await res.arrayBuffer()),
  );
  const size = { width, height, measured: true };

  return {
    ...size,
    base64,
    orientation: calculateOrientation(width, height),
    candidates: srcSetCandidates(imageSrc, size),
  };
};

/** Sizes, blur and `srcset` from the set's manifest, else by downloading the image. */
export const measureImage = async (
  imageSrc: string,
): Promise<ImageMeasurement> => {
  const fromSet = await readManifest(imageSrc);
  if (fromSet && fromSet !== FETCH_FAILED) return fromSet;

  console.warn(`Image probed (no manifest): ${imageSrc}`);
  try {
    return await probeImage(imageSrc);
  } catch (error) {
    if (fromSet === FETCH_FAILED)
      throw new Error(`Image could not be measured: ${imageSrc}`, {
        cause: error,
      });

    console.error(`Image placeholder failed: ${imageSrc}`, error);

    return {
      width: 1200,
      height: 800,
      measured: false,
      base64: "",
      orientation: "landscape",
      candidates: [],
    };
  }
};
