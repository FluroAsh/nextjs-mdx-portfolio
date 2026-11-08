"use client";

import { useEffect, useRef, useState } from "react";

import { formatSrcSet } from "@/utils/image";
import { cn } from "@/utils/misc";

import type { GalleryPhoto } from "../types";
import { formatTakenAt, frameNumber } from "../utils";

/** Column widths at each breakpoint, inside the 1024px frame with 24px gutters. */
const TILE_SIZES =
  "(min-width: 1024px) 236px, (min-width: 900px) calc((100vw - 84px) / 4), (min-width: 640px) calc((100vw - 72px) / 3), calc((100vw - 60px) / 2)";

type PhotoTileProps = {
  photo: GalleryPhoto;
  /** Display name of the photo's album, for the hover overlay. */
  albumTitle?: string;
  onOpen: () => void;
};

export const PhotoTile = ({ photo, albumTitle, onOpen }: PhotoTileProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Server-rendered images can finish before hydration attaches `onLoad`.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const takenAt = photo.takenAt && formatTakenAt(photo.takenAt);
  const overlayPlace = photo.location?.short ?? photo.location?.label;

  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        data-photo-id={photo.id}
        aria-label={`Open ${photo.title}`}
        className={cn(
          "group/tile relative block w-full overflow-hidden hover:cursor-zoom-in",
          "ring-1 ring-green-500/15 transition-[box-shadow] duration-150 ease-linear",
          "hover:ring-green-400 focus-visible:ring-green-400",
          "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-green-400",
        )}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        {/* Real blur when the set has one; the site's dither texture otherwise. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            photo.placeholder
              ? "scale-110 blur-md"
              : "bg-green-950/40 bg-[url('/static/images/texture-bayer-matrix-256.png')] bg-[length:128px_128px] bg-repeat mix-blend-screen",
            !isLoaded && !photo.placeholder && "animate-pulse",
          )}
          style={
            photo.placeholder
              ? { backgroundImage: `url(${photo.placeholder})` }
              : undefined
          }
        />

        <img
          ref={imgRef}
          src={photo.src}
          srcSet={
            photo.candidates.length ? formatSrcSet(photo.candidates) : undefined
          }
          sizes={photo.candidates.length ? TILE_SIZES : undefined}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "relative size-full object-cover transition-[opacity,filter] duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            "group-hover/tile:brightness-110",
          )}
        />

        {/* Hidden until hover or keyboard focus, so the grid reads as photographs first. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2",
            "bg-linear-to-t from-black/80 to-transparent pt-8",
            "font-mono text-[10px] tracking-wider uppercase",
            "opacity-0 transition-opacity duration-150 ease-linear",
            "group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100",
          )}
        >
          <span className="truncate text-neutral-200">
            <span className="mr-1.5 text-green-400 tabular-nums">
              {frameNumber(photo.frame)}
            </span>
            {overlayPlace}
          </span>
          {albumTitle && (
            <span className="shrink-0 border border-green-500/40 bg-black/60 px-1.5 py-px text-green-300">
              {albumTitle}
            </span>
          )}
        </span>
      </button>

      <figcaption className="mt-2 mb-1 min-w-0">
        <p className="truncate text-sm leading-tight font-medium text-neutral-100">
          {photo.title}
        </p>
        <p className="mt-0.5 truncate font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums">
          {takenAt ? takenAt.date : photo.location?.label}
        </p>
      </figcaption>
    </figure>
  );
};
