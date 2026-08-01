"use client";

import { motion as m } from "motion/react";

import { BilingualLabel } from "@/components/bilingual-label";
import { ScanlinePlane } from "@/components/scanline-plane";
import {
  ABOUT_ANCHOR_ID,
  ABOUT_FIELDS,
  ABOUT_HEADING,
  ABOUT_MARKER,
  ABOUT_PROSE,
} from "@/data/identity";
import { cn } from "@/utils/misc";

import { ENTER } from "../utils";

const MetadataStrip = () => (
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

export const AboutSection = ({
  className,
}: {
  className?: string;
} = {}) => {
  return (
    <section
      id={ABOUT_ANCHOR_ID}
      className={cn("relative scroll-mt-0", className)}
    >
      <ScanlinePlane vignette={0.3} />

      <div
        className={cn(
          "max-w-frame py-section relative z-10 mx-auto grid w-full px-6",
          "grid-cols-1 gap-x-10",
          "md:grid-cols-[8rem_1fr]",
        )}
      >
        {/* Full height, with a small tick at the bottom so the line ends deliberately rather than trailing off. */}
        <div
          className={cn(
            "relative",
            "md:col-start-1 md:row-start-1 md:border-r md:border-green-500/15",
          )}
        >
          {/* Grid aligns to the top of the row; this drops the label down onto the heading's first line instead. */}
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
