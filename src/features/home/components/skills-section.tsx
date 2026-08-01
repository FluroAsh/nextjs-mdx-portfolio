"use client";

import { motion as m, useReducedMotion } from "motion/react";

import { BilingualLabel } from "@/components/bilingual-label";
import { Marquee } from "@/components/marquee";
import { type Skill, skillsList } from "@/data/skills";
import { cn, zeroPad } from "@/utils/misc";

import { SETTLE } from "../utils";

/**
 * Toolchain — categorised field matrix on the page surface, with the ambient
 * ticker demoted to a ghosted back plane. About owns the CRT scanline band;
 * this chapter differentiates with the glyph field instead.
 */

const SECTION_MARKER = { zh: "技術", en: "TECH" } as const;

type Layer = {
  id: string;
  zh: string;
  en: string;
  names: Array<Skill["name"]>;
};

const LAYERS: Layer[] = [
  {
    id: "frontend",
    zh: "前端",
    en: "FRONTEND",
    names: ["react", "typescript", "nextjs", "tailwind", "emotioncss", "scss"],
  },
  {
    id: "backend",
    zh: "後端",
    en: "BACKEND",
    names: ["nodejs", "graphql", "prisma", "postgresql", "mongoDB"],
  },
  {
    id: "platform",
    zh: "平台",
    en: "PLATFORM",
    names: ["docker", "nginx", "aws"],
  },
];

const byName = new Map(skillsList.map((skill) => [skill.name, skill]));

const skillsFor = (layer: Layer) =>
  layer.names
    .map((name) => byName.get(name))
    .filter((skill): skill is Skill => Boolean(skill));

/** Resolved skills, not declared names, or the panel fractions stop summing. */
const ITEM_COUNT = LAYERS.reduce(
  (total, layer) => total + skillsFor(layer).length,
  0,
);

/* -------------------------------------------------------------------------
 * Back plane — the field
 * ---------------------------------------------------------------------- */

const FIELD_EDGE_FADE =
  "linear-gradient(to right, transparent, #000 96px, #000 calc(100% - 96px), transparent)";

const FIELD_ROWS = [
  { skills: skillsList.slice(0, 7), speed: 11, reverse: false },
  { skills: skillsList.slice(7), speed: 14, reverse: true },
];

const FieldPass = ({ skills }: { skills: Skill[] }) => (
  <div className="flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap">
    {skills.map((skill) => (
      <span
        key={skill.name}
        className="font-mono text-2xl tracking-[0.35em] uppercase sm:text-3xl"
      >
        {skill.label}
      </span>
    ))}
  </div>
);

/** The shared Marquee has no reduced-motion gate, so rows swap to static here when the preference is set. */
const GlyphField = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-green-400"
      style={{
        maskImage: FIELD_EDGE_FADE,
        WebkitMaskImage: FIELD_EDGE_FADE,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.035 }}
      transition={prefersReducedMotion ? { duration: 0 } : SETTLE}
    >
      <div className="flex h-full flex-col justify-center gap-6">
        {FIELD_ROWS.map((row, index) =>
          prefersReducedMotion ? (
            <div key={index} className="flex overflow-hidden">
              <FieldPass skills={row.skills} />
            </div>
          ) : (
            <Marquee key={index} speed={row.speed} reverse={row.reverse}>
              <FieldPass skills={row.skills} />
            </Marquee>
          ),
        )}
      </div>
    </m.div>
  );
};

/* -------------------------------------------------------------------------
 * Middle plane — the matrix
 * ---------------------------------------------------------------------- */

/** Quiet hover — structure takes the signal accent; content stays put. */
const Brackets = () => (
  <span aria-hidden className="pointer-events-none absolute inset-0">
    <span className="absolute top-0 left-0 size-2.5 border-t border-l border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
    <span className="absolute top-0 right-0 size-2.5 border-t border-r border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
    <span className="absolute bottom-0 left-0 size-2.5 border-b border-l border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
  </span>
);

const LayerPanel = ({ layer }: { layer: Layer }) => {
  const skills = skillsFor(layer);

  return (
    <div
      className={cn(
        "group bg-surface-panel relative px-4 pt-4 pb-5",
        "transition-colors duration-75",
        "hover:bg-[color-mix(in_oklab,white_10%,transparent)]",
      )}
    >
      <Brackets />

      <div className="flex items-baseline justify-between gap-3 border-b border-green-500/15 pb-2 transition-colors duration-75 group-hover:border-green-400/30">
        <h3>
          <BilingualLabel zh={layer.zh} en={layer.en} />
        </h3>
        {/* Fraction, not a bare count — a lone number here reads as a row index. */}
        <span className="font-mono text-[10px] tracking-wider text-green-500/70 tabular-nums transition-colors duration-75 group-hover:text-green-300">
          {zeroPad(skills.length)}
          <span className="text-green-500/40">/</span>
          {zeroPad(ITEM_COUNT)}
        </span>
      </div>

      <ol className="mt-3 space-y-1.5">
        {skills.map((skill, index) => {
          const Icon = skill.icon;

          return (
            <li
              key={skill.name}
              className="grid grid-cols-[1.25rem_1.25rem_1fr] items-center gap-x-2.5 font-mono text-[13px]"
            >
              <span className="text-[10px] tracking-wider text-green-500/70 tabular-nums transition-colors duration-75 group-hover:text-green-300">
                {zeroPad(index + 1)}
              </span>

              <Icon
                aria-hidden
                className="size-4 justify-self-center text-green-500/60 transition-colors duration-75 group-hover:text-green-300/80"
              />

              <span className="text-neutral-200">{skill.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Section
 * ---------------------------------------------------------------------- */

export const SkillsSection = ({
  className,
}: {
  className?: string;
} = {}) => (
  <section className={cn("relative overflow-hidden", className)}>
    <GlyphField />

    <div className="max-w-frame py-section relative z-10 mx-auto w-full px-6">
      <div
        className={cn(
          "mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2",
          "border-b border-green-500/15 pb-3",
          "font-mono text-[10px] tracking-wider text-green-500/70 uppercase",
        )}
      >
        <span>
          {ITEM_COUNT} ITEMS · {LAYERS.length} LAYERS
        </span>
        <BilingualLabel {...SECTION_MARKER} />
      </div>

      <div>
        <h2 className="text-4xl font-bold tracking-tight text-neutral-50">
          Toolchain
        </h2>
        <p className="max-w-measure mt-3 text-sm text-neutral-300 sm:text-base">
          What I build with. Still growing.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {LAYERS.map((layer) => (
          <LayerPanel key={layer.id} layer={layer} />
        ))}
      </div>
    </div>
  </section>
);
