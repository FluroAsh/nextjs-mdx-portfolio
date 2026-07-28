import { Marquee } from "@/components/marquee";
import { type Skill, skillsList } from "@/data/skills";
import { cn } from "@/utils/misc";

import { SectionTag } from "./section-tag";

const topRowSkills = skillsList.slice(0, Math.ceil(skillsList.length / 2));
const bottomRowSkills = skillsList.slice(Math.ceil(skillsList.length / 2));

/** Shared by both rows so they move at the same speed. Sharing a duration
 *  doesn't work, since the rows hold different amounts of content. */
const SKILL_ROW_SPEED = 76;

/** Fades both ends so rows enter and leave without a hard edge. */
const EDGE_FADE =
  "linear-gradient(to right, transparent, #000 80px, #000 calc(100% - 80px), transparent)";

const SkillRow = ({
  skills,
  reverse,
}: {
  skills: Skill[];
  reverse?: boolean;
}) => (
  <Marquee speed={SKILL_ROW_SPEED} reverse={reverse} copyClassName="py-2">
    {skills.map(({ name, label, icon: Icon, iconStyles, containerStyles }) => (
      <div
        key={name}
        className={cn(
          "mx-2 flex h-24 shrink-0 items-center justify-center gap-2 px-6",
          "rounded-md border border-neutral-800 bg-black/30",
          "transition-colors select-none",
          "hover:border-green-500 hover:bg-green-500/10 hover:text-green-500",
          containerStyles,
        )}
      >
        <Icon className={cn("size-10", iconStyles)} />
        {label ? label : null}
      </div>
    ))}
  </Marquee>
);

export const SkillsSection = () => (
  <section className="mx-auto pt-20 pb-8">
    <div className="px-8 pb-4 text-center">
      <SectionTag text="Technologies" />

      <h2
        className={cn(
          "pt-4 pb-1 text-4xl font-bold tracking-wide",
          "bg-gradient-to-r from-green-400 to-green-600",
          "bg-clip-text text-transparent",
        )}
      >
        My Digital Arsenal
      </h2>

      <p className="mx-auto max-w-2xl pt-4 text-sm text-neutral-300 sm:text-base">
        Tools and technologies I&apos;ve worked with throughout my journey as a
        developer. I&apos;m adding new tools to my belt every day!
      </p>
    </div>

    <div
      className="relative mx-auto max-w-4xl"
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      <SkillRow skills={topRowSkills} reverse />
      <SkillRow skills={bottomRowSkills} />
    </div>

    <div className="mt-6 text-center">
      <p className="text-xs text-neutral-500 italic">
        Hover/tap to pause scrolling
      </p>
    </div>
  </section>
);
