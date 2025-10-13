"use server";

import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import { IMAGE_SIZE } from "@/types";
import { getFileNameFromUrl } from "@/utils/image";

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
  sourceUrl: string,
  s3Origin: string,
  targetSize: IMAGE_SIZE | undefined,
) => {
  const fileName = getFileNameFromUrl(sourceUrl);

  // If the host (baesPath) is recognised, update the source URL to instead use the resized "large" image.
  const imageSrc = targetSize
    ? `${s3Origin}/${targetSize}_${fileName}`
    : sourceUrl;

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
