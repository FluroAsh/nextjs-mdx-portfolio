import { type ImageProps } from "./collection.types";

import { CollectionLightbox } from "./collection-lightbox";
import { ImageTile } from "./image-tile";

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
    <CollectionLightbox
      variant={variant}
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
      }))}
    />
  );
};
