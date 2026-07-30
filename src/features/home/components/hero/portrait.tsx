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
 * Not the LCP element — the city backdrop is. On mobile this still sits in the
 * first viewport, so the browser would promote a lazy image to High and race
 * the LCP request; `fetchPriority="low"` keeps it demoted. Bytes are kept down
 * too: dither compresses cleanly, and the painted width is ~320px on phones.
 *
 * Centred below `sm`, where the text and the photo share one column — anchored
 * right, the scattered edge ran straight through the surname.
 *
 * Below `sm` this is a row in the hero's column rather than a layer over it, and
 * the only row allowed to shrink. A short screen therefore takes height off the
 * photo instead of sliding it up over the text.
 */
export const HeroPortrait = () => (
  // The fade sits on this wrapper, not the mirrored layer below it: motion
  // writes `transform`, which would clobber the `scaleX(-1)`.
  <m.div
    className={cn(
      "pointer-events-none relative shrink basis-[34dvh] overflow-hidden",
      "sm:absolute sm:inset-0 sm:basis-auto",
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ...SETTLE, duration: 0.3 }}
  >
    <div
      className={cn(
        "absolute inset-x-0 top-0 -bottom-[3%] mx-auto w-[78%]",
        "sm:inset-x-auto sm:top-auto sm:-right-[10%] sm:bottom-0 sm:mx-0 sm:h-[92%] sm:w-[58%]",
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
        sizes="(max-width: 640px) 360px, (max-width: 1024px) 58vw, 46vw"
        quality={50}
        fetchPriority="low"
        className="object-contain object-bottom"
      />
    </div>
  </m.div>
);
