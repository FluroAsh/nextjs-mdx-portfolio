"use client";

import { motion as m } from "motion/react";

import { skillsList } from "@/data/skills";
import { cn } from "@/utils/misc";

export const SkillsSection = () => {
  return (
    <m.div
      className="group relative h-full overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-green-500/30 hover:shadow-green-500/10 lg:p-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium tracking-wider text-green-400 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            TECH STACK
          </div>

          <h2 className="mb-3 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent lg:text-4xl">
            Technologies & Tools
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 lg:text-base">
            A curated selection of technologies I work with to build modern,
            scalable applications.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
          {skillsList.map(
            ({ name, label, icon: Icon, iconStyles, containerStyles }, idx) => (
              <m.div
                key={name}
                className={cn(
                  "group/skill relative flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-sm transition-all duration-300",
                  "hover:scale-105 hover:border-green-500/50 hover:bg-neutral-800/50 hover:shadow-lg hover:shadow-green-500/10",
                  containerStyles,
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + idx * 0.03,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4 }}
              >
                <Icon
                  className={cn(
                    "size-10 transition-transform duration-300 group-hover/skill:scale-110 lg:size-12",
                    iconStyles,
                  )}
                />
                {label && (
                  <span className="text-center text-xs font-medium text-neutral-300 transition-colors group-hover/skill:text-neutral-100 lg:text-sm">
                    {label}
                  </span>
                )}

                {/* Hover glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-hover/skill:opacity-20" />
              </m.div>
            ),
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-neutral-700" />
          <span>Continuously expanding</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-neutral-700" />
        </div>
      </div>
    </m.div>
  );
};
