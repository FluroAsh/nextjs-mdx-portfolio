"use client";

import { useEffect, useRef } from "react";

import {
  FIXED_COLUMN_WIDTH,
  type SrcSetCandidate,
  formatSrcSet,
  imageSizes,
} from "@/utils/image";
import { cn } from "@/utils/misc";

type ClientImageProps = {
  /** Unique DOM id of the `<img>`, generated on the server so hydration matches. */
  imageId: string;
  /** URL of the image shown and opened by the lightbox. */
  src: string;
  /** Alternative text for the image. */
  alt: string;
  /** Intrinsic width of `src` in pixels. */
  width: number;
  /** Intrinsic height of `src` in pixels. */
  height: number;
  /** `landscape`, `portrait` or `square`; portrait and square use the fixed column. */
  orientation: string;
  /** Classes for the wrapping `<picture>`. */
  className: string;
  /** Base64 blur placeholder shown until the image loads. */
  blurDataURL: string;
  /** Files the browser may choose from, narrowest first; empty for no `srcset`. */
  candidates: SrcSetCandidate[];
};

export const ClientImage = ({
  imageId,
  src,
  alt,
  width,
  height,
  orientation,
  className,
  blurDataURL,
  candidates,
  ...props
}: ClientImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image loading for both SSR and client-side navigation
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalHeight > 0) {
      img.setAttribute("data-loaded", "true");
      img.style.opacity = "1";
      return;
    }

    const handleLoad = () => {
      img.setAttribute("data-loaded", "true");
      img.style.opacity = "1";
    };

    img.addEventListener("load", handleLoad);

    return () => img.removeEventListener("load", handleLoad);
  }, []);

  const isFixedWidth = /portrait|square/.test(orientation);

  return (
    // "my-0" override prevents prose margin from being applied to picture element
    <picture className={cn("relative my-0! overflow-hidden", className)}>
      {candidates.length > 0 && (
        <source
          srcSet={formatSrcSet(candidates)}
          sizes={imageSizes(isFixedWidth)}
          type="image/webp"
        />
      )}

      <img
        ref={imgRef}
        id={imageId}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        data-loaded="false"
        className={cn(
          "mx-auto max-w-full transition-opacity duration-300",
          "data-[loaded=false]:opacity-0 data-[loaded=true]:opacity-100",
        )}
        style={isFixedWidth ? { width: FIXED_COLUMN_WIDTH } : undefined}
        {...props}
      />

      <div
        role="presentation"
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: `url(${blurDataURL})` }}
      />
    </picture>
  );
};
