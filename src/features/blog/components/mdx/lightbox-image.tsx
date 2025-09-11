"use client";

import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import { ExpandIconHover } from "@/components/icons/expand-hover";

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
  children,
}: LightBoxImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!src || !alt) {
    throw new Error(
      "[LightboxImage]: Images must include src and alt attributes",
    );
  }

  return (
    <>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src, alt }]}
        render={{
          // Next/prev buttons are not needed for single images
          buttonNext: () => null,
          buttonPrev: () => null,
          slide: ({ slide }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.src}
              alt={slide.alt}
              className="max-h-full rounded-lg"
            />
          ),
        }}
        carousel={{ finite: true }}
        controller={{
          disableSwipeNavigation: true,
          closeOnBackdropClick: true,
        }}
        plugins={[Download]}
        styles={{
          container: {
            backgroundColor: "hsla(0, 0%, 0%, 0.75)",
            backdropFilter: "blur(8px)",
          },
        }}
      />

      <div
        onClick={() => setIsOpen(true)}
        className="group relative mx-auto max-h-full w-fit hover:cursor-pointer"
      >
        {children}
        {caption && <em>{caption}</em>}
        <ExpandIconHover />
      </div>
    </>
  );
};
