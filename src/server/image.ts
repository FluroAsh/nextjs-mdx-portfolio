"use server";

import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import type { ProbedSize } from "@/utils/image";

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

type ImagePlaceholder = ProbedSize & {
  /** Base64 blur placeholder; `""` when it could not be generated. */
  base64: string;
  /** Shape of the image; `undefined` only for non-numeric sizes. */
  orientation: Orientation | undefined;
  /** Width over height to two decimals. */
  aspectRatio: string;
};

export const getImagePlaceholder = async (
  imageSrc: string,
): Promise<ImagePlaceholder> => {
  try {
    const { width, height } = await probe(imageSrc);
    const { base64 } = await fetchPlaceholder(imageSrc);
    const orientation = calculateOrientation(width, height);
    const aspectRatio = (width / height).toFixed(2);

    return {
      width,
      height,
      measured: true,
      base64,
      orientation,
      aspectRatio,
    };
  } catch (error) {
    console.error(`Image placeholder failed: ${imageSrc}`, error);

    return {
      width: 1200,
      height: 800,
      measured: false,
      base64: "",
      orientation: "landscape",
      aspectRatio: "1.50",
    };
  }
};
