"use client";

import { motion as m } from "motion/react";

import { author } from "@/data/author";
import { HERO_FIELDS, HERO_NAME_LABEL } from "@/data/identity";
import { cn } from "@/utils/misc";

import { ENTER } from "../../utils";
import { BilingualLabel } from "@/components/bilingual-label";

/** The masthead lands in three steps: name, rule, fields. */
const enterStep = (index: number) => ({ ...ENTER, delay: index * 0.09 });

/**
 * The name: one colour, one weight. Colouring the first and last name
 * differently suggests a difference between them that isn't there.
 */
export const MastheadName = () => {
  const [firstName, lastName] = author.name.split(" ");

  return (
    <m.div
      className="max-w-frame mx-auto w-full px-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={enterStep(0)}
    >
      <BilingualLabel {...HERO_NAME_LABEL} />

      {/* Split over two lines so only the longer word sets the width, which
          stops it running into the photo as it scales up. */}
      <h1
        className="mt-2 leading-[0.92] font-medium tracking-tight text-neutral-50"
        style={{ fontSize: "clamp(3.5rem, 10vw, 8.5rem)" }}
      >
        {firstName}
        <br />
        {lastName}
      </h1>
    </m.div>
  );
};

export const MastheadFields = ({ className }: { className?: string }) => (
  <m.div
    className={cn(
      "max-w-frame mx-auto flex w-full gap-x-8 px-6 sm:gap-x-16",
      className,
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={enterStep(2)}
  >
    {HERO_FIELDS.map(({ zh, en, value }) => (
      <div key={en} className="flex flex-col gap-1.5">
        <BilingualLabel zh={zh} en={en} />
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.18em] text-green-600 uppercase",
            "sm:text-[11px]",
          )}
        >
          {value}
        </span>
      </div>
    ))}
  </m.div>
);

/** Runs the full width of the page, past the content column on both sides. */
export const HorizonRule = ({ className }: { className?: string }) => (
  <m.div
    aria-hidden
    className={cn("h-px w-full bg-green-500/20", className)}
    style={{ transformOrigin: "left" }}
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ ...enterStep(1), duration: 0.28 }}
  />
);
