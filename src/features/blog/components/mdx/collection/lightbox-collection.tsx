import { altToFilename } from "@/utils/image";

import { type ImageProps } from "./collection.types";
import { ImageTile } from "./image-tile";
import { LightboxView } from "./lightbox-view";

export enum CollectionVariant {
  TwoUp = "2up",
  ThreeUp = "3up",
  FourUp = "4up",
  SixUp = "6up",
}

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

export const ImageCollection = ({
  images,
  useLowerRes = true,
}: ImageCollectionProps) => {
  const variant = variantMapping[images.length] || CollectionVariant.TwoUp;
  const captionFontSize = images.length > 2 ? "text-xs" : "text-sm";

  return (
    <LightboxView
      variant={variant}
      // Ensure all image tiles fill the grid cell, even with mixed aspect ratios
      className="[&_div]:h-full [&_img]:h-full [&_img]:object-cover"
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
      slides={images.map((image) => ({
        src: image.src,
        alt: image.alt,
        download: {
          // ?: Search param is required for CORS issue, see: https://yet-another-react-lightbox.com/plugins/download#Cross-OriginImages
          url: `${image.src}?download`,
          filename: altToFilename(image.alt ?? crypto.randomUUID()),
        },
      }))}
    />
  );
};
