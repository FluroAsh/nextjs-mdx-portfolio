"use client";

import { useState } from "react";

import { type ImageSource } from "yet-another-react-lightbox";

import { ExpandIconHover } from "@/components/icons/expand-hover";
import { useLightboxDimensions } from "@/hooks/use-lightbox-dimensions";
import { altToFilename } from "@/utils/image";

import { ImageCaption } from "./image-caption";
import { Lightbox } from "./lightbox";
import { LightboxTrigger } from "./lightbox-trigger";

type LightBoxImageProps = {
  /** Largest file of the set; the download link points at it. */
  src?: string;
  srcSet?: ImageSource[];
  alt?: string;
  caption?: string;
  children: React.ReactNode;
};

export const LightboxImage = ({
  src,
  srcSet,
  alt,
  caption,
  children: serverImage,
}: LightBoxImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dimensions, containerRef } = useLightboxDimensions();

  const imageDimensions = dimensions[0];

  if (!src || !alt) {
    throw new Error(
      "[LightboxImage]: Images must include src and alt attributes",
    );
  }

  return (
    <>
      <Lightbox
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slides={[
          {
            src,
            srcSet,
            alt,
            width: imageDimensions?.width,
            height: imageDimensions?.height,
            download: {
              // ?: Search param is required for CORS issue, see: https://yet-another-react-lightbox.com/plugins/download#Cross-OriginImages
              url: `${src}?download`,
              filename: altToFilename(alt),
            },
          },
        ]}
        render={{
          // No need for next/prev buttons on single images
          buttonNext: () => null,
          buttonPrev: () => null,
        }}
        carousel={{ finite: true }}
      />

      <figure
        ref={containerRef}
        className="plate-ticks relative isolate mx-auto w-fit"
      >
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
