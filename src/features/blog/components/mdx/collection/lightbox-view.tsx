"use client";

import { useState } from "react";

import { useLightboxDimensions } from "@/hooks/use-lightbox-dimensions";
import { cn, zeroPad } from "@/utils/misc";

import { Lightbox } from "../lightbox";
import { LightboxTrigger } from "../lightbox-trigger";
import { CollectionVariant } from "./lightbox-collection";

type LightboxViewProps = {
  variant: CollectionVariant;
  slides: {
    src: string;
    alt?: string;
    download?: {
      url: string;
      filename: string;
    };
  }[];
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
        // Ticks mark the collection as one plate. Per tile they multiply into
        // noise, which is the whole reason the marks read as an instrument.
        className={cn(
          "plate-ticks relative isolate grid gap-1",
          variantLayoutClasses[variant],
          className,
        )}
      >
        {images.map((serverImage, i) => (
          // Wraps the RSC image so the click can be handled on the client.
          <LightboxTrigger
            key={`${variant}-wrapper-${i + 1}`}
            onOpen={() => handleClick(i)}
            label={`Expand image ${i + 1} of ${slides.length}${slides[i]?.alt ? `: ${slides[i].alt}` : ""}`}
          >
            {serverImage}
          </LightboxTrigger>
        ))}
      </div>

      <Lightbox
        index={index}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slides={slidesWithDimensions}
        on={{ view: ({ index }) => setIndex(index) }} // Syncs state
        controls={() => (
          <div
            className={cn(
              "absolute left-1/2 z-10 -translate-x-1/2",
              "bottom-4 sm:top-6 sm:bottom-auto",
              "bg-surface-page/85 px-3 py-1.5 backdrop-blur-sm",
            )}
          >
            <span className="font-mono text-[11px] tracking-wider text-green-400 tabular-nums">
              {zeroPad(index + 1)}
              <span className="mx-1 text-green-600">/</span>
              {zeroPad(slides.length)}
            </span>
          </div>
        )}
      />
    </div>
  );
};
