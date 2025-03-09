"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

import { type Skill, skillsList } from "@/data/author";

import { cn } from "@/utils/misc";
import { defaultViewMargin } from "@/lib/constants";
import { SectionTag } from "./section-tag";

const topRowSkills = skillsList.slice(0, Math.ceil(skillsList.length / 2));
const bottomRowSkills = skillsList.slice(Math.ceil(skillsList.length / 2));

const SkillRow = ({
  skills,
  className,
}: {
  skills: Skill[];
  className?: string;
}) => (
  <div className="flex">
    <div className={cn("flex py-2", className)}>
      {Array(2) // Any more than 2 would require an update to the animate-scroll-* classes to prevent reflow
        .fill([...skills])
        .map((_, i) => {
          return skills.map(
            ({ name, label, icon: Icon, iconStyles, containerStyles }, x) => (
              <div
                key={`${name}-${i}-${x}`}
                className={cn(
                  "mx-2 flex h-24 items-center justify-center gap-2 rounded-md border border-neutral-800 bg-black/30 px-6",
                  "backdrop-blur-lg transition-colors select-none hover:border-green-500 hover:bg-green-500/10 hover:text-green-500",
                  containerStyles,
                )}
              >
                <Icon className={cn("size-10", iconStyles)} />
                {label ? label : null}
              </div>
            ),
          );
        })}
    </div>
  </div>
);

export const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: defaultViewMargin });

  return (
    <section ref={ref} className="mx-auto pt-18 pb-8">
      <div className="mb-6 px-8 text-center">
        <SectionTag text="Technologies" />

        <h2 className="mt-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text pb-1 text-4xl font-bold tracking-wide text-transparent">
          My Digital Arsenal
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-300">
          Tools and technologies I&apos;ve worked with throughout my journey as
          a developer. I&apos;m adding new tools to my belt every day!
        </p>
      </div>

      <div
        className="group relative mx-auto max-w-4xl overflow-x-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 80px, #000 calc(100% - 80px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 80px, #000 calc(100% - 80px), transparent)",
        }}
      >
        <SkillRow
          skills={topRowSkills}
          className={cn(
            "animate-scroll-right group-hover:animate-scroll-right-pause",
            !isInView && "animate-scroll-right-pause",
          )}
        />
        <SkillRow
          skills={bottomRowSkills}
          className={cn(
            "animate-scroll-left group-hover:animate-scroll-left-pause",
            !isInView && "animate-scroll-left-pause",
          )}
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-neutral-500 italic">
          Hover to pause scrolling
        </p>
      </div>
    </section>
  );
};
