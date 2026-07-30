"use client";

import { useRef } from "react";

import type { LatestPost, SystemStatus } from "@/data/identity";
import { cn } from "@/utils/misc";

import { HeroMarquee } from "./marquee";
import { HorizonRule, MastheadFields, MastheadName } from "./parts";
import { CityPlane, HeroBackdrop } from "./planes";
import { HeroPortrait } from "./portrait";
import { ReadoutCluster } from "./readout-cluster";

/**
 * The hero. On desktop the name sits on the left and the photo on the right;
 * below `sm` they stack into three rows: readouts, name, photo.
 */
export const HeroSection = ({
  posts,
  system,
}: {
  posts: LatestPost[];
  system: SystemStatus;
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  // The `+1px` makes the marquee's bottom border overlap the mobile nav's top
  // border. Without it the two sit next to each other and read as one 2px line.
  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative flex flex-col",
        "h-[calc(100dvh-var(--spacing-mobile-nav)+1px)]",
        "sm:h-[calc(100dvh-var(--spacing-header))]",
      )}
    >
      {/* The marquee sits outside this box, so the background layers and the
          photo are cut off at its top edge instead of showing through it. */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <CityPlane scrollTarget={sectionRef} />
        <HeroBackdrop />

        {/* Below `sm` these three share this column as rows rather than stacking
            as layers, so a short screen squeezes them together instead of
            printing one on top of another. Only the photo gives up height. */}
        <ReadoutCluster />

        <div
          className={cn(
            "relative z-10 flex shrink-0 grow basis-auto flex-col justify-end",
            "mt-8 mb-14",
            "sm:my-0 sm:shrink sm:basis-0 sm:pb-[14vh]",
          )}
        >
          <MastheadName />

          <HorizonRule className="mt-6" />

          <MastheadFields className="mt-4" />
        </div>

        <HeroPortrait />
      </div>

      <HeroMarquee posts={posts} system={system} />
    </section>
  );
};
