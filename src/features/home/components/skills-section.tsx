"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { motion as m } from "motion/react";

import { skillsList } from "@/data/skills";
import { cn } from "@/utils/misc";

export const SkillsSection = () => {
  const [showAll, setShowAll] = useState(false);

  // Show 8 skills on mobile by default, all on desktop
  const mobileSkillsLimit = 8;
  const displayedSkills = showAll
    ? skillsList
    : skillsList.slice(0, mobileSkillsLimit);
  const hasMoreSkills = skillsList.length > mobileSkillsLimit;

  return (
    <m.div
      className="group relative h-full overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-6 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-green-500/30 hover:shadow-green-500/10 sm:p-8 lg:p-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium tracking-wider text-green-400 backdrop-blur-sm sm:mb-3 sm:px-4 sm:py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            TECH STACK
          </div>

          <h2 className="mb-2 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:mb-3 sm:text-3xl lg:text-4xl">
            Technologies & Tools
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 lg:text-base">
            A curated selection of technologies I work with to build modern,
            scalable applications.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:gap-4">
          {displayedSkills.map(
            ({ name, label, icon: Icon, iconStyles, containerStyles }, idx) => {
              const isNewItem = idx >= mobileSkillsLimit;
              const shouldAnimate = isNewItem && showAll;

              return (
                <m.div
                  key={name}
                  className={cn(
                    "group/skill relative flex flex-col items-center justify-center gap-2 rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-3 backdrop-blur-sm transition-all duration-300 sm:gap-3 sm:p-4",
                    "hover:scale-105 hover:border-green-500/50 hover:bg-neutral-800/50 hover:shadow-lg hover:shadow-green-500/10",
                    containerStyles,
                  )}
                  initial={
                    shouldAnimate
                      ? { opacity: 0, y: 20, scale: 0.9 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: shouldAnimate ? (idx - mobileSkillsLimit) * 0.05 : 0,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -4 }}
                >
                  <Icon
                    className={cn(
                      "size-8 transition-transform duration-300 group-hover/skill:scale-110 sm:size-10 lg:size-12",
                      iconStyles,
                    )}
                  />
                  {label && (
                    <span className="text-center text-[11px] font-medium text-neutral-300 transition-colors group-hover/skill:text-neutral-100 sm:text-xs lg:text-sm">
                      {label}
                    </span>
                  )}

                  {/* Hover glow effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-hover/skill:opacity-20" />
                </m.div>
              );
            },
          )}
        </div>

        {/* Show More Button - Mobile Only */}
        {hasMoreSkills && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-800/50 bg-neutral-900/30 px-4 py-2.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-green-500/50 hover:bg-neutral-800/50 hover:text-green-400 sm:hidden"
          >
            <span>
              {showAll
                ? "Show less"
                : `Show ${skillsList.length - mobileSkillsLimit} more`}
            </span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-300",
                showAll && "rotate-180",
              )}
            />
          </button>
        )}

        {/* Footer note - Hidden on mobile when collapsed */}
        <div
          className={cn(
            "mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500 sm:mt-8",
            !showAll && hasMoreSkills && "hidden sm:flex",
          )}
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-neutral-700" />
          <span>Continuously expanding</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-neutral-700" />
        </div>
      </div>
    </m.div>
  );
};
