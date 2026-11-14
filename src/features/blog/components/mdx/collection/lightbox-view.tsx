"use client";

import { useState } from "react";

import { cn } from "@/utils/misc";

import { LightboxTrigger } from "../lightbox-trigger";
import { PostLightbox, type PostSlide } from "../post-lightbox";
import { CollectionVariant } from "./collection.types";

type LightboxViewProps = {
  variant: CollectionVariant;
  slides: PostSlide[];
  images: React.ReactNode[];
  /** Adds the lightbox's rail of ticks for moving through the collection. */
  scrubber?: boolean;
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
  scrubber,
  className,
}: LightboxViewProps) => {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <div
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
            onOpen={() => setIndex(i)}
            label={`Expand image ${i + 1} of ${slides.length}${slides[i]?.alt ? `: ${slides[i].alt}` : ""}`}
          >
            {serverImage}
          </LightboxTrigger>
        ))}
      </div>

      <PostLightbox
        slides={slides}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
        scrubber={scrubber}
      />
    </div>
  );
};
