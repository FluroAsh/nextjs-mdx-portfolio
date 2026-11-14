/** The photo is bounded by height, so this over-asks on wide screens rather than under-asks on tall ones. */
export const SIZES = "100vw";

export type LightboxSlide = {
  /** Largest file; also what identifies the slide, so it must be unique in the list. */
  src: string;
  /** Narrower files the browser may pick in place of `src`. */
  srcSet?: string;
  /** Alternative text for the image. */
  alt: string;
  /** Intrinsic width of `src` in pixels; with `height`, sizes the frame before the file loads. */
  width?: number;
  /** Intrinsic height of `src` in pixels. */
  height?: number;
  /** Base64 blur shown until the file loads. */
  placeholder?: string;
};

/** Fetches the file the lightbox will show for a slide, ahead of showing it. */
export const preload = ({ src, srcSet }: LightboxSlide) => {
  const image = new Image();
  if (srcSet) {
    image.sizes = SIZES;
    image.srcset = srcSet;
  }
  image.src = src;
};
