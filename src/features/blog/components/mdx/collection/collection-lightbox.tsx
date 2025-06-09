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

  console.log(index);
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
        on={{
          view: ({ index }) => setIndex(index),
        }}
        render={{
          controls: () => (
            <div className="absolute top-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-neutral-800 bg-black/80 px-4 py-2 backdrop-blur-xs">
              <span className="text-sm font-medium tracking-wide text-green-500">
                {index + 1} <span className="mx-1 text-neutral-200">of</span>{" "}
                {slides.length}
              </span>
            </div>
          ),
          slide: ({ slide }) => (
            <div className="flex h-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt || ""}
                className="rounded-lg"
              />
            </div>
          ),
        }}
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
