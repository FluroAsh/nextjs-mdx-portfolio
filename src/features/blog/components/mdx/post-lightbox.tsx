"use client";

import { Download } from "lucide-react";

import { downloadImage } from "@/components/lightbox/download-image";
import { IconButton } from "@/components/lightbox/icon-button";
import { Lightbox, type LightboxSlide } from "@/components/lightbox/lightbox";

export type PostSlide = LightboxSlide & {
  /** Shown under the photo. */
  caption?: string;
};

type PostLightboxProps = {
  /** One image, or the images of one collection; never the whole post. */
  slides: PostSlide[];
  /** Index into `slides`; `null` when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** The lightbox as a post uses it: no side panel, so download sits in the header. */
export const PostLightbox = ({ slides, index, ...rest }: PostLightboxProps) => {
  const slide = index === null ? undefined : slides[index];

  return (
    <Lightbox
      {...rest}
      slides={slides}
      index={index}
      caption={
        slide?.caption && <span className="truncate">{slide.caption}</span>
      }
      actions={
        slide && (
          <IconButton
            label="Download image"
            onClick={() => downloadImage(slide.src, slide.alt)}
          >
            <Download />
          </IconButton>
        )
      }
    />
  );
};
