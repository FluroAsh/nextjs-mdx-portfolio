"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";

type CollectionLightboxProps = {
  slides: { src: string; alt?: string }[];
  images: React.ReactNode[];
  className?: string;
};

export const CollectionLightbox = ({
  slides,
  images,
}: CollectionLightboxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const handleClick = (idx: number) => {
    setIndex(idx);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="relative grid grid-cols-2 gap-1">
        {images.map((image, i) => (
          // Wrap RSC images to handle click event on the client-side (trigger lightbox)
          <div
            key={i === 0 ? "left-2up-wrapper" : "right-2up-wrapper"}
            className="aboslute inset-0"
            onClick={() => handleClick(i)}
          >
            {image}
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={index}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
        plugins={[Download]}
        styles={{
          container: {
            backgroundColor: "hsla(0, 0%, 0%, 0.75)",
            backdropFilter: "blur(8px)",
          },
        }}
      />
    </div>
  );
};
