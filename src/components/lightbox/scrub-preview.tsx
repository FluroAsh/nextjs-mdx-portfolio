"use client";

import { useState } from "react";

import { cn } from "@/utils/misc";

import type { LightboxSlide } from "./slide";

/** Width of the preview at its largest, so it draws on a small file. */
const PREVIEW_SIZES = "36rem";

type ScrubPreviewProps = {
  slide: LightboxSlide;
  /** Where the slide sits in the set, e.g. `29 / 121`. */
  position: string;
  /** The preview image, so the lightbox can start the photo's entrance from where it sat. */
  imageRef: React.Ref<HTMLImageElement>;
  /** Reports the file the browser picked for a slide once it has loaded. */
  onFileLoad: (src: string, url: string) => void;
};

/** Where a photo of the given width-to-height ratio sits inside an `object-contain` image, which letterboxes it within the element's box. */
export const containedRect = (image: HTMLImageElement, ratio: number) => {
  const box = image.getBoundingClientRect();
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;
  return new DOMRect(
    box.left + (box.width - width) / 2,
    box.top + (box.height - height) / 2,
    width,
    height,
  );
};

/** What the scrubber is passing, in a frame of fixed size over the photo on show, so photos of any shape pass without the page moving. */
export const ScrubPreview = ({
  slide,
  position,
  imageRef,
  onFileLoad,
}: ScrubPreviewProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === slide.src;

  return (
    <div
      aria-hidden
      className={cn(
        "plate-ticks bg-surface-page/90 pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
        "flex size-[clamp(18rem,40vmin,36rem)] flex-col gap-2 p-2 outline outline-green-500/40 backdrop-blur-sm",
        "animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none",
      )}
    >
      <div
        className="relative min-h-0 flex-1 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage:
            !isLoaded && slide.placeholder
              ? `url(${slide.placeholder})`
              : undefined,
        }}
      >
        {/* No `key`: changing `src` on the same element is what cancels a load the scrubber has moved past. */}
        <img
          src={slide.src}
          srcSet={slide.srcSet}
          sizes={slide.srcSet && PREVIEW_SIZES}
          ref={imageRef}
          alt=""
          onLoad={(event) => {
            setLoadedSrc(slide.src);
            onFileLoad(slide.src, event.currentTarget.currentSrc);
          }}
          className={cn(
            "absolute inset-0 size-full object-contain",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <p className="font-mono text-[10px] tracking-wider text-neutral-400 tabular-nums">
        {position}
      </p>
    </div>
  );
};
