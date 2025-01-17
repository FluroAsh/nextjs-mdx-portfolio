"use server";

import { getPlaiceholder } from "plaiceholder";
import probe from "probe-image-size";

import { env } from "@/lib/env";

type Size = "thumbnail" | "small" | "medium" | "large";
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

export const getImagePlaceholder = async (
  sourceURL: string,
  resizedSize: Size,
) => {
  const { basePath } = env;
  const fileName = sourceURL.split(`${basePath}/`)[1];

  const imageSrc = resizedSize
    ? `${basePath}/${resizedSize}_${fileName}`
    : sourceURL;

  // FYI: S3 will cap the image width/height to the users screen dimensions if we're using a large src image
  const { width, height } = await probe(`${basePath}/large_${fileName}`);

  const res = await fetch(imageSrc);
  const buffer = Buffer.from(await res.arrayBuffer());
  const { base64 } = await getPlaiceholder(buffer);

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
