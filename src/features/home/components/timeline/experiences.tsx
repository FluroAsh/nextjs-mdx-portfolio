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
      "Contributed to the frontend development of Australia's leading department store e-commerce platform, enhancing responsiveness, performance, and user experience for hundreds of thousands of customers.",
      "Played a key role in revamping the MYER One linking experience, pioneering frontend involvement in experimentation, and introducing developer tools and processes to improve productivity.",
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
      "Intensive full-stack coding bootcamp focused on modern web development. Achieved proficiency in React, Node.js, and full-stack development in 10 short months.",
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
        <p>
          Competed semi-professionally in the AU Overwatch esports scene while
          working part-time. Developed team communication, strategic thinking,
          and performance under pressure. Participated in various tournaments
          mostly online, as-well as in-person, most notably IEM Sydney 2019.
        </p>
        <CustomLink
          href="https://liquipedia.net/overwatch/Fluro"
          className="mt-2 inline-block text-green-500 transition-colors duration-75 hover:text-green-400 [&_svg]:size-2.5"
        >
          Liquipedia
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
    role: "Bachelors of Information Systems",
    content: [
      "Studied database analysis & design, data visualisation, project management, and business analysis.",
      "Developed strong foundations in SQL and business analysis.",
    ],
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
