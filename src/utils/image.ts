const VARIANTS = [
  "placeholder",
  "thumbnail",
  "small",
  "medium",
  "large",
  "full",
] as const;

/** Variant prefixes a stored image key can carry. */
export type ImageVariant = (typeof VARIANTS)[number];

export type ParsedImageUrl = {
  /** Scheme and host, e.g. `https://example.com`; `""` for a root-relative path. */
  origin: string;
  /** Path the image set lives under, without leading or trailing slash; `""` at the root. */
  folder: string;
  /** Base name without variant prefix or extension. */
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
 * Set-folder keys are `{folder}/{name}/{variant}_{name}.webp`; `null` for any
 * other URL (another host, a file in `/public`), which has no sized siblings.
 */
export const parseImageUrl = (url: string): ParsedImageUrl | null => {
  const match = IMAGE_URL.exec(url);
  if (!match) return null;

  const [, origin = "", dir = "", stem, extension, suffix = ""] = match;
  const [, prefix, rest] = VARIANT_PREFIX.exec(stem) ?? [];
  const parent = dir.split("/").at(-1);

  // The folder repeats the name, which also settles whether a leading variant
  // word is a prefix or part of the name.
  const isOriginal = parent === stem;
  if (!isOriginal && rest !== parent) return null;
  const name = isOriginal ? stem : rest;

  return {
    origin,
    folder: dir.slice(0, -name.length - 1),
    name,
    variant: isOriginal ? null : (prefix as ImageVariant),
    extension,
    suffix,
  };
};

export const variantUrl = (
  { origin, folder, name, extension, suffix }: ParsedImageUrl,
  variant: ImageVariant | null,
) => {
  const file = `${variant ? `${variant}_` : ""}${name}${extension}`;
  const path = [folder, name, file].filter(Boolean);
  return `${origin}/${path.join("/")}${suffix}`;
};

/** The CDN has no resizing API, only pre-generated variants. `medium_` is the
 *  one variant present in every set. */
export const downsizedUrl = (url: string) => {
  const parsed = parseImageUrl(url);
  return parsed?.variant === "large" ? variantUrl(parsed, "medium") : url;
};

/** A display variant every set has, with the pixel bound on its longest edge. */
type SizedVariant = [variant: ImageVariant, bound: number];

/** Estimates sibling widths for sets without a manifest. A missing key is a 403, hence only variants every set has; smallest first. */
const SIZED_VARIANTS: SizedVariant[] = [
  ["medium", 800],
  ["large", 1440],
];

/** An image's size as measured at build. */
export type ProbedSize = {
  /** Intrinsic width in pixels. */
  width: number;
  /** Intrinsic height in pixels. */
  height: number;
  /** `false` when measuring failed and `width` and `height` are a stand-in. */
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
  if (!parsed) return [self];

  // Bounds are on the longest edge, so a portrait's siblings are narrower than their bound.
  const scale = Math.min(1, width / height);
  const fitted = SIZED_VARIANTS.map(([variant, bound]) => ({
    url: variantUrl(parsed, variant),
    width: Math.round(bound * scale),
  }));

  // `large` is the inline ceiling: an original or full-size file with sized
  // siblings is left out, since it is the lightbox's file. It keeps a sibling
  // as wide as itself so that width is still offered.
  const isSized = SIZED_VARIANTS.some(
    ([variant]) => variant === parsed.variant,
  );
  // The image's own file is listed once, with its measured width, never also as an estimated sibling.
  const siblings = fitted.filter(
    (candidate) =>
      candidate.url !== src &&
      (isSized ? candidate.width < width : candidate.width <= width),
  );
  return isSized || !siblings.length ? [...siblings, self] : siblings;
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
  // The base lets a manifest key (a path, not a URL) through.
  const newURL = new URL(url, "http://localhost");
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
