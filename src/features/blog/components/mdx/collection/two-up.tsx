import { CollectionLightbox } from "./collection-lightbox";

import { ImageTile } from "./image-tile";
import { type ImageProps } from "@/types";

type TwoUpProps = {
  left: ImageProps;
  right: ImageProps;
  /** Uses "large" res images by default, if true will use "medium" res. */
  useLowerRes?: boolean;
};

export const TwoUp = ({ left, right, useLowerRes = false }: TwoUpProps) => (
  <CollectionLightbox
    images={[
      <ImageTile
        key="right-2up-tile"
        src={left.src}
        alt={left.alt}
        caption={left.caption}
        useLowerRes={useLowerRes}
      />,
      <ImageTile
        key="left-2up-tile"
        src={right.src}
        alt={right.alt}
        caption={right.caption}
        useLowerRes={useLowerRes}
      />,
    ]}
    slides={[
      { src: left.src, alt: left.alt },
      { src: right.src, alt: right.alt },
    ]}
  />
);
