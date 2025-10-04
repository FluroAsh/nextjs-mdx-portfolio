"use client";

import { useState } from "react";

import { ExpandIconHover } from "@/components/icons/expand-hover";
import { useLightboxDimensions } from "@/hooks/use-lightbox-dimensions";
import { altToFilename } from "@/utils/image";

import { Lightbox } from "./lightbox";

type LightBoxImageProps = {
  src?: string;
  alt?: string;
  caption?: string;
  children: React.ReactNode;
};

export const LightboxImage = ({
  src,
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

      <div
        ref={containerRef}
        onClick={() => setIsOpen(true)}
        className="group relative mx-auto max-h-full w-fit hover:cursor-pointer"
      >
        {serverImage}
        {caption && <em>{caption}</em>}
        <ExpandIconHover />
      </div>
    </>
  );
};
