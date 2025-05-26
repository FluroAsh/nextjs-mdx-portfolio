"use server";

import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import { env } from "@/lib/env";

type Size = "thumbnail" /*| "small" */ | "medium" | "large";
type Orientation = "landscape" | "portrait" | "square";

const calculateOrientation = (
  width: number,
  height: number,
): Orientation | null => {
  switch (true) {
    case width > height:
      return "landscape";
    case height > width:
      return "portrait";
    case height === width:
      return "square";
    default:
      return null;
  }
};

/**
 * Fetches an image from the provided source URL, converts it to a buffer,
 * and generates a placeholder using the `getPlaiceholder` lib.
 *
 * This function is useful for generating low-quality image placeholders (LQIP)
 * for images to improve perceived performance and user experience.
 */
const fetchPlaceholder = async (src: string) => {
  const res = await fetch(src);
  const buffer = Buffer.from(await res.arrayBuffer());
  return await getPlaiceholder(buffer);
};

export const getImagePlaceholder = async (
  sourceURL: string,
  resizedSize: Size | undefined,
) => {
  const { basePath } = env;
  const fileName = sourceURL.split(`${basePath}/`)[1];

  const imageSrc = resizedSize
    ? `${basePath}/${resizedSize}_${fileName}`
    : sourceURL;

  const { width, height } = await probe(imageSrc);

  const { base64 } = await fetchPlaceholder(imageSrc);
  const orientation = calculateOrientation(width, height);
  const aspectRatio = (width / height).toFixed(2);

  return {
    width,
    height,
    base64,
    orientation,
    aspectRatio,
  };
};
