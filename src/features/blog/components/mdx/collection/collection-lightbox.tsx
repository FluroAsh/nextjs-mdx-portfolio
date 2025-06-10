"use client";

import { useState } from "react";
import { cn } from "@/utils/misc";

import { CollectionVariant } from "./image-collection";

import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";

type CollectionLightboxProps = {
  variant: CollectionVariant;
  slides: { src: string; alt?: string }[];
  images: React.ReactNode[];
  className?: string;
};

const variantLayoutClasses: Record<CollectionVariant, string> = {
  [CollectionVariant.TwoUp]: "grid-cols-2",
  [CollectionVariant.ThreeUp]:
    "grid-cols-2 sm:grid-cols-3 [&>:first-child]:col-span-2 sm:[&>:first-child]:col-span-1",
  [CollectionVariant.FourUp]: "grid-cols-4",
  [CollectionVariant.SixUp]: "grid-cols-6",
};

export const CollectionLightbox = ({
  variant,
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
      <div className={cn("relative grid gap-1", variantLayoutClasses[variant])}>
        {images.map((image, i) => (
          // Wrap RSC images to handle click event on the client-side (trigger lightbox)
          <div
            key={`${variant}-wrapper-${i + 1}`}
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
          // Sync the index with lightbox state to handle updating the controls
          view: ({ index }) => setIndex(index),
        }}
        render={{
          controls: () => (
            <div className="absolute top-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-neutral-800 bg-black/80 px-4 py-2 backdrop-blur-xs">
              <span className="text-sm font-semibold tracking-wide text-green-500">
                {index + 1} <span className="mx-1 text-neutral-200">of</span>{" "}
                {slides.length}
              </span>
            </div>
          ),
          slide: ({ slide }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.src} alt={slide.alt} className="rounded-lg" />
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
