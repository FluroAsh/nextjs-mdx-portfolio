const VARIANTS = [
  "placeholder",
  "thumbnail",
  "small",
  "medium",
  "large",
] as const;

export type ImageVariant = (typeof VARIANTS)[number];

export type ParsedImageUrl = {
  layout: "nested" | "flat";
  origin: string;
  folder: string;
  name: string;
  /** `null` is the un-prefixed original. */
  variant: ImageVariant | null;
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
