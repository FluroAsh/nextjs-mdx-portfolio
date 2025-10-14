"use client";

import { useEffect, useRef } from "react";

import { IMAGE_SIZE } from "@/types";
import { getFileNameFromUrl } from "@/utils/image";
import { cn } from "@/utils/misc";

type ClientImageProps = {
  imageId: string;
  s3Origin: string;
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
  s3Origin,
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

  // Generate responsive image variants
  const generateSrcVariant = (size: IMAGE_SIZE) => {
    if (!s3Origin) return src;
    return `${s3Origin}/${size}_${getFileNameFromUrl(src)}`;
  };

  // Create responsive srcset for different screen sizes
  const srcSet = [
    `${generateSrcVariant(IMAGE_SIZE.THUMBNAIL)} 320w`,
    `${generateSrcVariant(IMAGE_SIZE.MEDIUM)} 640w`,
    `${generateSrcVariant(IMAGE_SIZE.LARGE)} 1200w`,
  ].join(", ");

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

  // Inline script for immediate execution before React hydration (first paint)
  // This only runs on initial page load, not on client-side navigation
  // const inlineScript = `
  //   (function() {
  //     const img = document.getElementById('${imageId}');
  //     if (img && img.complete && img.naturalHeight > 0) {
  //       img.setAttribute('data-loaded', 'true');
  //       img.style.opacity = '1';
  //     }
  //   })();
  // `;

  return (
    <picture className={cn("relative overflow-hidden", className)}>
      <source
        srcSet={srcSet}
        sizes={
          isLightboxImage
            ? "100vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 620px"
        }
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
        // suppressHydrationWarning
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

      {/* Inline script for immediate execution before React hydration (first paint) */}
      {/* NOTE: This is not currently working when navigating via client-side, eg: Blog List -> Blog Post */}
      {/* The script will only execute on initial page load */}
      {/* <script
        dangerouslySetInnerHTML={{
          __html: inlineScript,
        }}
      /> */}
    </picture>
  );
};
