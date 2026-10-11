"use client";

import { useEffect, useRef } from "react";

import { imageSizes, imageSrcSet } from "@/utils/image";
import { cn } from "@/utils/misc";

type ClientImageProps = {
  imageId: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: string;
  className: string;
  blurDataURL: string;
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

  // The 400px column below and `imageSizes` describe the same slot.
  const isFixedWidth = /portrait|square/.test(orientation);

  return (
    // "my-0" override prevents prose margin from being applied to picture element
    <picture className={cn("relative my-0! overflow-hidden", className)}>
      <source
        srcSet={imageSrcSet(src, width, height)}
        sizes={imageSizes(isFixedWidth)}
        type="image/webp"
      />

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
          isFixedWidth && "w-[400px]",
        )}
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
