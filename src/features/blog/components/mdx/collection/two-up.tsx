import { CollectionLightbox } from "./collection-lightbox";

import { ImageTile } from "./image-tile";
import { type ImageProps } from "@/types";

type TwoUpProps = {
  left: ImageProps;
  right: ImageProps;
};

export const TwoUp = ({ left, right }: TwoUpProps) => (
  <CollectionLightbox
    images={[
      <ImageTile src={left.src} alt={left.alt} caption={left.caption} />,
      <ImageTile src={right.src} alt={right.alt} caption={right.caption} />,
    ]}
    slides={[
      { src: left.src, alt: left.alt },
      { src: right.src, alt: right.alt },
    ]}
  />
);
