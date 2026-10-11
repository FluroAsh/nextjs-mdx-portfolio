export const VARIANTS = [
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

/** The CDN has no resizing API, only pre-generated variants, and `medium_` is
 *  the one present on every asset — `small_` and `thumbnail_` are not. */
export const downsizedUrl = (url: string) => {
  const parsed = parseImageUrl(url);
  return parsed?.variant === "large" ? variantUrl(parsed, "medium") : url;
};

/**
 * Stopgap until manifests carry real sizes: the pixel bound each display
 * variant was fitted to, smallest first. Only variants every set of a layout
 * has are listed, since a missing key is a 403.
 */
const SIZED_VARIANTS: Record<
  ParsedImageUrl["layout"],
  [variant: ImageVariant, bound: number][]
> = {
  flat: [
    ["small", 500],
    ["medium", 750],
    ["large", 1000],
  ],
  nested: [
    ["medium", 800],
    ["large", 1440],
  ],
};

/**
 * `width` and `height` are the intrinsic size of `src`. Only narrower siblings
 * are offered, so a caller that downsized gets nothing larger back.
 */
export const imageSrcSet = (src: string, width: number, height: number) => {
  const parsed = parseImageUrl(src);
  const own = `${src} ${width}w`;
  // Any other flat URL (a GIF host, a file in /public) has no sized siblings.
  const isForeign = parsed?.layout === "flat" && parsed.folder !== "legacy";
  if (!parsed || isForeign) return own;

  const sized = SIZED_VARIANTS[parsed.layout];
  // Flat sets were fitted to the longest edge, nested ones to the width.
  const scale = parsed.layout === "flat" ? Math.min(1, width / height) : 1;
  const siblings = sized
    .map(([variant, bound]) => [variant, Math.round(bound * scale)] as const)
    .filter(([, sibling]) => sibling < width)
    .map(([variant, sibling]) => `${variantUrl(parsed, variant)} ${sibling}w`);

  // An original with siblings is left out: it is the lightbox's file.
  const isSized = sized.some(([variant]) => variant === parsed.variant);
  const offersOwn = isSized || !siblings.length;
  return [...siblings, ...(offersOwn ? [own] : [])].join(", ");
};

/** Mirrors the post layout's article column; change them together. */
export const imageSizes = (isFixedWidth: boolean) =>
  isFixedWidth
    ? "(min-width: 448px) 400px, calc(100vw - 48px)"
    : "(min-width: 1024px) 680px, (min-width: 900px) calc(100vw - 344px), calc(100vw - 48px)";

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
