"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/utils/misc";

type ClientImageProps = {
  imageId: string;
  src: string;
  isLightboxImage: boolean;
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
  isLightboxImage,
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

    // Check if image has already loaded on component mount
    if (img.complete && img.naturalHeight > 0) {
      img.setAttribute("data-loaded", "true");
      img.style.opacity = "1";
      return;
    }

    // Not loaded yet - set up load listener
    const handleLoad = () => {
      img.setAttribute("data-loaded", "true");
      img.style.opacity = "1";
    };

    img.addEventListener("load", handleLoad);

    return () => img.removeEventListener("load", handleLoad);
  }, []);

  // TODO: Should take into account orientations
  // Need to review how to better set this up, currently not all portrait images have the same widths... So this is a bit hacky.
  const srcSet = [
    // `${src.replace("large_", "small_")} 320w`,
    `${src.replace("large_", "medium_")} 640w`,
    `${src} 1200w`,
  ].join(", ");

  return (
    // "my-0" override prevents prose margin from being applied to picture element
    <picture className={cn("relative my-0! overflow-hidden", className)}>
      <source
        srcSet={srcSet}
        sizes={isLightboxImage ? "100vw" : "(width <= 768px) 640px, 1200px"}
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
          /portrait|square/.test(orientation) && "w-[400px]",
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
