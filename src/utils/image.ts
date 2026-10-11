const VARIANTS = [
  "placeholder",
  "thumbnail",
  "small",
  "medium",
  "large",
  "lossless",
] as const;

/** Variant prefixes a stored image key can carry. */
export type ImageVariant = (typeof VARIANTS)[number];

export type ParsedImageUrl = {
  /** `nested`: `{folder}/{name}/{variant}_{name}.webp`. `flat`: `{folder}/{variant}_{name}.webp`. */
  layout: "nested" | "flat";
  /** Scheme and host, e.g. `https://example.com`; `""` for a root-relative path. */
  origin: string;
  /** Path the image set lives under, without leading or trailing slash; `""` at the root. */
  folder: string;
  /** Base name without variant prefix or extension; for flat keys it includes the hash. */
  name: string;
  /** `null` is the un-prefixed original. */
  variant: ImageVariant | null;
  /** File extension including the dot, e.g. `.webp`. */
  extension: string;
  /** Trailing `?query` and/or `#hash`, carried through unchanged. */
  suffix: string;
};

const IMAGE_URL = /^(https?:\/\/[^/]+)?\/(?:(.+)\/)?([^/]+?)(\.\w+)([?#].*)?$/;
const VARIANT_PREFIX = new RegExp(`^(${VARIANTS.join("|")})_(.+)$`);

/**
 * Nested keys are `{folder}/{name}/{variant}_{name}.webp`; flat ones are
 * `{folder}/{variant}_{name}.webp` beside an un-prefixed original.
 */
export const parseImageUrl = (url: string): ParsedImageUrl | null => {
  const match = IMAGE_URL.exec(url);
  if (!match) return null;

  const [, origin = "", dir = "", stem, extension, suffix = ""] = match;
  const [, prefix, rest] = VARIANT_PREFIX.exec(stem) ?? [];
  const parent = dir.split("/").at(-1);

  // The folder repeats the name in a nested key, which also settles whether a
  // leading variant word is a prefix or part of the name.
  const isOriginal = parent === stem || !prefix;
  const name = isOriginal ? stem : rest;
  const layout = parent === name ? "nested" : "flat";

  return {
    layout,
    origin,
    folder: layout === "nested" ? dir.slice(0, -name.length - 1) : dir,
    name,
    variant: isOriginal ? null : (prefix as ImageVariant),
    extension,
    suffix,
  };
};

export const variantUrl = (
  { layout, origin, folder, name, extension, suffix }: ParsedImageUrl,
  variant: ImageVariant | null,
) => {
  const file = `${variant ? `${variant}_` : ""}${name}${extension}`;
  const path = [folder, layout === "nested" && name, file].filter(Boolean);
  return `${origin}/${path.join("/")}${suffix}`;
};

/** The CDN has no resizing API, only pre-generated variants. `medium_` is the
 *  one variant present in every set of both layouts. */
export const downsizedUrl = (url: string) => {
  const parsed = parseImageUrl(url);
  return parsed?.variant === "large" ? variantUrl(parsed, "medium") : url;
};

/** The only folder whose flat keys are Strapi sets with sized siblings. */
export const FLAT_LAYOUT_FOLDER = "legacy";

type SizedLayout = {
  /** What the bounds were fitted to: `longest-edge` scales portraits down, `width` never upscales. */
  fit: "longest-edge" | "width";
  /** Display variants every set of the layout has, smallest first, with their pixel bound. */
  variants: [variant: ImageVariant, bound: number][];
};

/** Stopgap until manifests carry real sizes. A missing key is a 403, hence only variants every set has. */
const SIZED_VARIANTS: Record<ParsedImageUrl["layout"], SizedLayout> = {
  flat: {
    fit: "longest-edge",
    variants: [
      ["small", 500],
      ["medium", 750],
      ["large", 1000],
    ],
  },
  nested: {
    fit: "width",
    variants: [
      ["medium", 800],
      ["large", 1440],
    ],
  },
};

/** What the build-time probe reports about an image. */
export type ProbedSize = {
  /** Intrinsic width in pixels. */
  width: number;
  /** Intrinsic height in pixels. */
  height: number;
  /** `false` when the probe failed and `width` and `height` are a stand-in. */
  measured: boolean;
};

/** One file a browser may pick from a `srcset`. */
export type SrcSetCandidate = {
  /** Location of the file. */
  url: string;
  /** Intrinsic width of the file in pixels. */
  width: number;
};

/**
 * Candidates are narrowest first. Only narrower siblings are offered, so a
 * caller that downsized gets nothing larger back. Empty when the size is a
 * guess, since the widths would be invented.
 */
export const srcSetCandidates = (
  src: string,
  { width, height, measured }: ProbedSize,
): SrcSetCandidate[] => {
  if (!measured) return [];

  const parsed = parseImageUrl(src);
  const self = { url: src, width };
  // Any other flat URL (a GIF host, a file in /public) has no sized siblings.
  const isForeign =
    parsed?.layout === "flat" && parsed.folder !== FLAT_LAYOUT_FOLDER;
  if (!parsed || isForeign) return [self];

  const { fit, variants } = SIZED_VARIANTS[parsed.layout];
  const scale = fit === "longest-edge" ? Math.min(1, width / height) : 1;
  const fitted = variants.map(([variant, bound]) => ({
    url: variantUrl(parsed, variant),
    width: Math.round(bound * scale),
  }));

  // A flat original's width is known, so an equal-width sibling is kept and
  // the original only joins when it is wider than every sibling.
  const isFlatOriginal = parsed.layout === "flat" && !parsed.variant;
  const siblings = fitted.filter((candidate) =>
    isFlatOriginal ? candidate.width <= width : candidate.width < width,
  );

  // Other originals with siblings are left out: they are the lightbox's file.
  const isSized = variants.some(([variant]) => variant === parsed.variant);
  const widest = fitted.at(-1)!.width;
  const offersSelf =
    isSized || !siblings.length || (isFlatOriginal && width > widest);
  return offersSelf ? [...siblings, self] : siblings;
};

export const formatSrcSet = (candidates: SrcSetCandidate[]) =>
  candidates.map(({ url, width }) => `${url} ${width}w`).join(", ");

/** `--container-frame` in `src/css/theme.css`. */
const FRAME_WIDTH = 1024;
/** Page gutters of 24px a side. */
const GUTTERS = 48;
/** Side panel plus its gap, shown from the 900px breakpoint. */
const SIDE_PANEL = 296;
const SIDE_PANEL_BREAKPOINT = 900;
/** Width of the column portrait and square images render in, set by `client-image.tsx`. */
export const FIXED_COLUMN_WIDTH = 400;

/** Mirrors the post layout's article column; change them together. */
export const imageSizes = (isFixedWidth: boolean) =>
  isFixedWidth
    ? `(min-width: ${FIXED_COLUMN_WIDTH + GUTTERS}px) ${FIXED_COLUMN_WIDTH}px, calc(100vw - ${GUTTERS}px)`
    : `(min-width: ${FRAME_WIDTH}px) ${FRAME_WIDTH - GUTTERS - SIDE_PANEL}px, (min-width: ${SIDE_PANEL_BREAKPOINT}px) calc(100vw - ${GUTTERS + SIDE_PANEL}px), calc(100vw - ${GUTTERS}px)`;

export const getFileNameFromUrl = (url: string) => {
  const newURL = new URL(url);
  return newURL.pathname.split("/").pop() || "";
};

/**
 * Transforms alt text into a safe filename format for downloading images.
 * Replaces spaces with dashes, removes non-alphanumeric characters (except dashes),
 * and converts to lowercase.
 */
export const altToFilename = (text: string) =>
  text
    .replace(/ /g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove any non-alphanumeric characters
    .toLowerCase();
