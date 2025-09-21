"use client";

import { useState } from "react";

import { useLightboxDimensions } from "@/hooks/use-lightbox-dimensions";
import { cn } from "@/utils/misc";

import { Lightbox } from "../lightbox";
import { CollectionVariant } from "./lightbox-collection";

type LightboxViewProps = {
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

export const LightboxView = ({
  variant,
  slides,
  images,
  className,
}: LightboxViewProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const { dimensions, containerRef } = useLightboxDimensions();

  const slidesWithDimensions = slides.map((slide, i) => ({
    ...slide,
    width: dimensions[i]?.width,
    height: dimensions[i]?.height,
  }));

  const handleClick = (idx: number) => {
    setIndex(idx);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={cn(
          "relative grid gap-1",
          variantLayoutClasses[variant],
          className,
        )}
      >
        {images.map((serverImage, i) => (
          // Wrap RSC images to handle click event on the client-side (trigger lightbox)
          <div
            key={`${variant}-wrapper-${i + 1}`}
            className="aboslute inset-0"
            onClick={() => handleClick(i)}
          >
            {serverImage}
          </div>
        ))}
      </div>

      <Lightbox
        index={index}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slides={slidesWithDimensions}
        on={{ view: ({ index }) => setIndex(index) }} // Syncs state
        controls={() => (
          <div className="absolute top-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-neutral-800 bg-black/80 px-4 py-2 backdrop-blur-xs">
            <span className="text-sm font-semibold tracking-wide text-green-500">
              {index + 1} <span className="mx-1 text-neutral-200">of</span>{" "}
              {slides.length}
            </span>
          </div>
        )}
      />
    </div>
  );
};
