"use client";

import Image from "next/image";

import { motion as m } from "motion/react";

import { cn } from "@/utils/misc";

import { SETTLE } from "../../utils";

/**
 * Fades out the scattered edge. In the source image those specks get *brighter*
 * the further they scatter, so without this they look like confetti.
 *
 * Written for the unflipped image: `scaleX(-1)` flips the mask too, so
 * `to right` actually fades towards the left of the screen.
 */
const DISSOLVE_FALLOFF =
  "linear-gradient(to right, black 68%, transparent 88%)";

/**
 * `priority` because this image is the LCP element, not the heading as you
 * would expect.
 *
 * Centred below `sm`, where the text and the photo share one column — anchored
 * right, the scattered edge ran straight through the surname. The mobile height
 * here has to match the space the name block leaves for it.
 */
export const HeroPortrait = () => (
  // The fade sits on this wrapper, not the mirrored layer below it: motion
  // writes `transform`, which would clobber the `scaleX(-1)`. Kept short
  // because this is the LCP element and it cannot count as painted until it
  // is visible.
  <m.div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ...SETTLE, duration: 0.3 }}
  >
    <div
      className={cn(
        "absolute inset-x-0 -bottom-[3%] mx-auto h-[34dvh] w-[78%]",
        "sm:inset-x-auto sm:-right-[10%] sm:bottom-0 sm:mx-0 sm:h-[92%] sm:w-[58%]",
        "lg:-right-[6%] lg:w-[46%]",
      )}
      style={{
        // Flipped so the scattered edge faces inward, into the layout, rather
        // than off the side of the screen.
        transform: "scaleX(-1)",
        maskImage: DISSOLVE_FALLOFF,
        WebkitMaskImage: DISSOLVE_FALLOFF,
      }}
    >
      <Image
        src="/static/images/hero-portrait.webp"
        alt="Ashley Thompson, rendered as a dot-matrix dither"
        fill
        priority
        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 58vw, 46vw"
        className="object-contain object-bottom"
      />
    </div>
  </m.div>
);
