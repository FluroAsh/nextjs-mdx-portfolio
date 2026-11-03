import { lightboxSlide } from "@/server/image";
import { altToFilename } from "@/utils/image";

import { CollectionVariant, type ImageProps } from "./collection.types";
import { ImageTile } from "./image-tile";
import { LightboxView } from "./lightbox-view";

const variantMapping: Record<number, CollectionVariant> = {
  2: CollectionVariant.TwoUp,
  3: CollectionVariant.ThreeUp,
  4: CollectionVariant.FourUp,
  6: CollectionVariant.SixUp,
};

type ImageCollectionProps = {
  images: ImageProps[];
  /** Uses "large" res images by default, if true will use "medium" res. */
  useLowerRes?: boolean;
};

export const ImageCollection = async ({
  images,
  useLowerRes = true,
}: ImageCollectionProps) => {
  const variant = variantMapping[images.length] || CollectionVariant.TwoUp;
  const slides = await Promise.all(
    images.map(async (image) => {
      const slide = await lightboxSlide(image.src);
      return {
        ...slide,
        alt: image.alt,
        download: {
          // ?: Search param is required for CORS issue, see: https://yet-another-react-lightbox.com/plugins/download#Cross-OriginImages
          url: `${slide.src}?download`,
          filename: altToFilename(image.alt ?? crypto.randomUUID()),
        },
      };
    }),
  );
  const captionFontSize = images.length > 2 ? "text-xs" : "text-sm";

  return (
    <LightboxView
      variant={variant}
      // Ensure all image tiles fill the grid cell, even with mixed aspect ratios
      className="[&_div]:h-full [&_img]:size-full [&_img]:object-cover [&_picture]:size-full [&_picture]:object-cover"
      images={images.map((image, i) => (
        <ImageTile
          key={`${variant}-tile-${i}`}
          src={image.src}
          alt={image.alt ?? image.caption}
          caption={image.caption}
          useLowerRes={useLowerRes}
          className={captionFontSize}
        />
      ))}
      slides={slides}
    />
  );
};
