"use client";

import Image from "next/image";
import { RefObject } from "react";

import {
  motion as m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { SETTLE } from "../../utils";

/** Strongest behind the photo, faded out before it reaches the name. */
const DENSITY_MASK =
  "linear-gradient(to left, black 0%, black 30%, transparent 85%)";

/** Inlined so it costs no extra request and can't flash in after paint. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

/**
 * Blends the page colour into the About section's, so there is no visible step
 * where the two meet. Starts from `transparent` rather than a solid colour: the
 * page texture sits at `z-index: -1`, and anything solid would cover it up.
 */
export const HeroBackdrop = () => (
  <m.div
    aria-hidden
    className="pointer-events-none absolute inset-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={SETTLE}
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent 0%, transparent 45%, var(--surface-section) 100%)",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
    />
  </m.div>
);

/**
 * Melbourne's CBD as a wireframe, sitting furthest back. Faded out towards the
 * left rather than drawn evenly, which clears space for the name and keeps the
 * detail behind the photo, where the scattered edge needs something to break
 * up against.
 */
export const CityPlane = ({
  scrollTarget,
}: {
  scrollTarget: RefObject<HTMLElement | null>;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"],
    // The section owns this ref, so it isn't attached yet when a layout effect
    // would read it. Without this, motion quietly measures the whole page.
    layoutEffect: false,
  });

  // Moves slower than the page rather than against it, which is what makes it
  // feel further away. Rounded so the compositor doesn't soft-paint the bitmap
  // on a fractional translate (reads as blur until the next layout/resize).
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : 90],
  );

  return (
    // This box does the cropping and the fading; only the image inside it
    // moves. Move this element instead and the image escapes past the bottom of
    // the section, taking the fade with it.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: DENSITY_MASK, WebkitMaskImage: DENSITY_MASK }}
    >
      <m.div className="absolute inset-0 -top-[10%] h-[120%]" style={{ y }}>
        <div className="absolute inset-0 opacity-[0.1]">
          <Image
            src="/static/images/hero-city-grid.webp"
            alt=""
            fill
            unoptimized // Already a compressed 2048px WebP.
            preload
            fetchPriority="high"
            className="object-cover object-[62%_55%]"
          />
        </div>
      </m.div>
    </div>
  );
};
