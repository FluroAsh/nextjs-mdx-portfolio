"use client";

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
        id={imageId}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        data-loaded="false"
        suppressHydrationWarning
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

      {/*
       * This is required as images in the viewport may have already loaded through the serverside HTML
       * by the time React has hydrated. It's innevitable because we need to
       */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                const img = document.getElementById('${imageId}');
                if (img && img.complete && img.naturalHeight > 0) {
                  // Images that load immediately via serverside HTML
                  img.setAttribute('data-loaded', 'true');
                  img.style.opacity = '1';
                } else {
                  // Images that load after React has hydrated
                  img.addEventListener('load', function() {
                    img.setAttribute('data-loaded', 'true');
                    img.style.opacity = '1';
                  });
                }
              })();
            `,
        }}
      />
    </picture>

    // This works without the IIFE (for above the fold)...
    // <img
    //   src={src}
    //   alt={alt}
    //   width={width}
    //   height={height}
    //   loading="lazy"
    // />
  );
};
