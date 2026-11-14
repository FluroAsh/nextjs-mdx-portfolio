"use client";

import { useState } from "react";

import { ExpandIconHover } from "@/components/icons/expand-hover";

import { ImageCaption } from "./image-caption";
import { LightboxTrigger } from "./lightbox-trigger";
import { PostLightbox, type PostSlide } from "./post-lightbox";

type LightBoxImageProps = Partial<PostSlide> & {
  children: React.ReactNode;
};

export const LightboxImage = ({
  children: serverImage,
  caption,
  ...slide
}: LightBoxImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { src, alt } = slide;

  if (!src || !alt) {
    throw new Error(
      "[LightboxImage]: Images must include src and alt attributes",
    );
  }

  return (
    <>
      <PostLightbox
        slides={[{ ...slide, src, alt, caption }]}
        index={isOpen ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setIsOpen(false)}
      />

      <figure className="plate-ticks relative isolate mx-auto w-fit">
        <LightboxTrigger
          onOpen={() => setIsOpen(true)}
          label={`Expand image: ${alt}`}
          className="relative block"
        >
          {serverImage}
          <ExpandIconHover />
        </LightboxTrigger>

        {caption && <ImageCaption caption={caption} />}
      </figure>
    </>
  );
};
