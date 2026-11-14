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

/**
 * What the scrubber is passing, over the photo on show. It is the photo and nothing else, so on release the picture
 * that grows into the frame is the one already on screen. Its box is fixed and the photo is fitted inside it,
 * so photos of any shape pass without the page moving.
 */
export const ScrubPreview = ({
  slide,
  position,
  imageRef,
  onFileLoad,
}: ScrubPreviewProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === slide.src;
  const ratio =
    slide.width && slide.height ? slide.width / slide.height : undefined;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
        "flex size-[clamp(18rem,40vmin,36rem)] items-center justify-center",
        "animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none",
      )}
    >
      <div
        className={cn(
          "plate-ticks bg-surface-page relative bg-cover bg-center shadow-2xl shadow-black outline outline-green-500/40",
          !ratio ? "size-full" : ratio >= 1 ? "w-full" : "h-full",
        )}
        style={{
          aspectRatio: ratio,
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
        <span className="image-caption tabular-nums">{position}</span>
      </div>
    </div>
  );
};
