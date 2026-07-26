import { CustomLink } from "@/features/blog/components/mdx/link";
import { cn } from "@/utils/misc";

export type ExperienceType = "work" | "education";

export type Experience = {
  /** Organisation or, for side pursuits, the pursuit itself. */
  title: string;
  /** Inclusive start year. */
  start: number;
  /** Inclusive end year, or `null` while ongoing. */
  end: number | null;
  /** The hat worn during that period. */
  role: string;
  content: string | string[] | React.ReactNode;
  location: string;
  type: ExperienceType;
};

/**
 * Bilingual labels for the record type. Traditional Chinese to match the glyphs
 * used in the hero (網絡, 代碼, 學無止境) rather than introducing a second script.
 */
export const TYPE_LABEL_ZH: Record<ExperienceType, string> = {
  work: "工作",
  education: "學習",
};

export const TYPE_LABEL_EN: Record<ExperienceType, string> = {
  work: "WORK",
  education: "STUDY",
};

/**
 * Years are stored as numbers rather than a display string so the rail ticks and
 * the status readout are derived from the same source as the label — a hand
 * written "2022 - Current" would drift the moment either is edited.
 */
export const formatPeriod = ({
  start,
  end,
}: Pick<Experience, "start" | "end">) => `${start} - ${end ?? "Current"}`;

export const EXPERIENCES: Experience[] = [
  {
    title: "MYER",
    start: 2022,
    end: null,
    role: "Frontend Engineer",
    content: [
      "Frontend engineer on one of Australia's largest e-commerce platforms, shipping customer-facing features across legacy and micro-frontend architectures. Led the Minibag pre-checkout experience — $50,000 in additional revenue within 4.5 days of launch — and migrated search recommendations to a headless Dynamic Yield integration, setting the pattern the team now uses for all future DY-driven features.",
      "Primary Dynamic Yield subject matter expert across teams — built a custom development tool adopted by the wider team, shipped 20+ experiments, and led the integration of retail media advertising (Mirakl), introducing a new revenue stream for the business.",
    ],
    location: "Melbourne, Australia",
    type: "work",
  },
  {
    title: "CoderAcademy Fullstack Bootcamp",
    start: 2021,
    end: 2022,
    role: "Student",
    content:
      "Intensive 10-month full-stack bootcamp. Built practical proficiency in React, Node.js, and end-to-end application delivery through project-based learning",
    location: "Melbourne, Australia",
    type: "education",
  },
  {
    title: "Overwatch: Semi-Pro Player",
    start: 2018,
    end: 2020,
    role: "Player & Coach (Fluro)",
    content: (
      <>
        <p className="mb-2">
          Competed and coached semi-professionally in the Australian Overwatch
          scene under the tag Fluro, including a run at IEM Sydney 2019. Led
          roster decisions, VOD reviews, and in-game shot-calling. Developed
          strong communication under pressure, strategic thinking, and the
          ability to get a group to execute as a unit.
        </p>
        <p className="mb-2">
          It&apos;s a different kind of engineering problem: real-time systems
          thinking with human components that don&apos;t always follow the spec.
          The discipline carried forward — structured feedback, fast iteration,
          and staying composed at 2-2 in a best of 5 series.
        </p>
        <CustomLink
          href="https://liquipedia.net/overwatch/Fluro"
          className="mt-2 inline-block text-green-500 transition-colors duration-75 hover:text-green-400 [&_svg]:size-2.5"
        >
          Career History
        </CustomLink>
      </>
    ),
    location: "Home Sweet Home",
    type: "work",
  },
  {
    title: "Swinburne University",
    start: 2014,
    end: 2017,
    role: "Bachelor of Business (Information Systems)",
    content:
      "Studied database design, data visualisation, project management, and business analysis. Built foundational skills in SQL and translating business requirements into technical solutions.",
    location: "Hawthorn, Australia",
    type: "education",
  },
];

/**
 * Content authored as an array becomes discrete paragraphs; anything else is
 * already renderable and passes straight through.
 */
export const ExperienceBody = ({ content }: Pick<Experience, "content">) => {
  if (!Array.isArray(content)) return <>{content}</>;

  return (
    <>
      {content.map((paragraph, index) => (
        <p key={index} className={cn(index > 0 && "mt-2")}>
          {paragraph}
        </p>
      ))}
    </>
  );
};
