"use client";

import { motion as m } from "motion/react";

import {
  ABOUT_ANCHOR_ID,
  ABOUT_FIELDS,
  ABOUT_HEADING,
  ABOUT_MARKER,
  ABOUT_PROSE,
} from "@/data/identity";
import { cn } from "@/utils/misc";

import { ENTER } from "../utils";
import { BilingualLabel } from "./bilingual-label";

/** Spacing does the grouping — real divider lines get stranded when it wraps. */
const MetadataStrip = () => (
  // Capped to the same width as the text below, so their right edges line up.
  <dl
    className={cn(
      "max-w-measure mt-6 flex flex-wrap items-baseline gap-x-7 gap-y-2 py-3",
      "border-y border-green-500/15",
      "sm:gap-x-9",
    )}
  >
    {ABOUT_FIELDS.map(({ zh, en, value }, index) => (
      <m.div
        key={en}
        className="flex items-baseline gap-x-2"
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ ...ENTER, delay: index * 0.05 }}
      >
        <dt>
          <BilingualLabel zh={zh} en={en} />
        </dt>
        <dd className="font-mono text-[13px] text-neutral-200">{value}</dd>
      </m.div>
    ))}
  </dl>
);

/**
 * Sits over the content to suggest you are looking at a screen.
 *
 * The scanlines are faded out before they reach any edge, or the effect stops
 * on a hard line at the section boundary. The darkened edges are what make it
 * look like a CRT, done with a gradient since blur isn't used anywhere here.
 */
const EDGE_FADE =
  "radial-gradient(115% 90% at 50% 50%, black 30%, transparent 88%)";

const ScanlinePlane = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, var(--scanline-color) 0px, var(--scanline-color) 1px, transparent 1px, transparent var(--scanline-pitch))",
        maskImage: EDGE_FADE,
        WebkitMaskImage: EDGE_FADE,
      }}
    />

    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(120% 95% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
      }}
    />
  </div>
);

export const AboutSection = () => {
  return (
    <section
      id={ABOUT_ANCHOR_ID}
      className="bg-surface-section relative scroll-mt-0 border-b border-green-500/40"
    >
      {/* No border on top — the marquee's bottom border is already there. */}
      <ScanlinePlane />

      <div
        className={cn(
          "max-w-frame py-section relative z-10 mx-auto grid w-full px-6",
          "grid-cols-1 gap-x-10",
          "md:grid-cols-[8rem_1fr]",
        )}
      >
        {/* Full height, with a small tick at the bottom so the line ends
              deliberately rather than trailing off. */}
        <div
          className={cn(
            "relative",
            "md:col-start-1 md:row-start-1 md:border-r md:border-green-500/15",
          )}
        >
          {/* Grid aligns to the top of the row; this drops the label down
                onto the heading's first line instead. */}
          <BilingualLabel
            zh={ABOUT_MARKER.zh}
            en={ABOUT_MARKER.en}
            className="block md:mt-[21px]"
          />

          <span
            aria-hidden
            className={cn(
              "absolute -right-px bottom-0 hidden h-px w-2.5",
              "bg-green-500/40",
              "md:block",
            )}
          />
        </div>

        <div className="mt-6 md:col-start-2 md:row-start-1 md:mt-0">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-50">
            {ABOUT_HEADING}
          </h2>

          <MetadataStrip />

          {/* Never faded in: this can appear above the fold, and fading it
                would slow down LCP. */}
          <div className="max-w-measure mt-8 space-y-4 text-neutral-300">
            {ABOUT_PROSE.map((paragraph) => (
              <p key={paragraph} className="text-sm sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
