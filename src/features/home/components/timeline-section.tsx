"use client";

import { isValidElement } from "react";
import { BriefcaseIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";

import { cn } from "@/utils/misc";
import { CustomLink } from "@/features/blog/components/mdx/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { SectionTag } from "./section-tag";

const experiences = [
  {
    title: "MYER",
    subtitle: "2022 - Current",
    cardTitle: "Frontend Engineer",
    content: [
      "Contributed to the frontend development of Australia's leading department store e-commerce platform, enhancing responsiveness, performance, and user experience for hundreds of thousands of customers.",
      "Played a key role in revamping the MYER One linking experience, pioneering frontend involvement in experimentation, and introducing developer tools and processes to improve productivity.",
    ],
    location: "Melbourne, Australia",
    type: "work",
  },
  {
    title: "CoderAcademy Fullstack Bootcamp",
    subtitle: "2021 - 2022",
    cardTitle: "Student",
    content:
      "Intensive full-stack coding bootcamp focused on modern web development. Achieved proficiency in React, Node.js, and full-stack development in 10 short months.",
    location: "Melbourne, Australia",
    type: "education",
  },
  {
    title: "Overwatch: Semi-Pro Player",
    subtitle: "2018 - 2020",
    cardTitle: "Player & Coach (Fluro)",
    content: (
      <>
        <p className="mb-2">
          Competed semi-professionally in the AU Overwatch esports scene while
          working part-time. Developed team communication, strategic thinking,
          and performance under pressure. Participated in various tournaments
          mostly online, as-well as in-person, most notably IEM Sydney 2019.
        </p>
        <CustomLink
          href="https://liquipedia.net/overwatch/Fluro"
          className="text-green-500 transition-colors duration-75 hover:text-green-600 [&_svg]:size-2.5"
        >
          Liquidpedia
        </CustomLink>
      </>
    ),
    location: "Home Sweet Home",
    type: "work",
  },
  {
    title: "Swinburne University",
    subtitle: "2014 - 2017",
    cardTitle: "Bachelors of Information Systems",
    content: [
      "Studied database analysis & design, data visualisation, project management, and business analysis.",
      "Developed strong foundations in SQL and business analysis.",
    ],
    location: "Hawthorn, Australia",
    type: "education",
  },
];

export function TimelineSection() {
  return (
    <section className="relative">
      <div className="px-8 pb-4 text-center">
        <SectionTag text="Timeline" className="self-center" />
        <h2 className="mt-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-center text-4xl font-bold text-transparent">
          The Journey So Far...
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-300 sm:text-base">
          Here&apos;s a brief overview of my professional and educational
          journey through the years.
        </p>
      </div>

      <div className="px-6">
        <div
          className={cn(
            "relative mt-4 space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:rounded-full before:bg-green-500",
            "before:via-green-400 before:to-green-200 md:before:right-0 md:before:left-0 md:before:mx-auto",
          )}
        >
          {experiences.map((experience, index) => (
            <TimelineItem key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const formatContent = (content: string | string[] | React.ReactNode) => {
  if (!isValidElement(content) && Array.isArray(content)) {
    return content.map((paragraph, i) => (
      <p key={i} className={cn(i > 0 ? "mt-2" : "")}>
        {paragraph}
      </p>
    ));
  }

  return content;
};

type ItemProps = { experience: (typeof experiences)[number]; index: number };

function TimelineItem({ experience, index }: ItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative flex items-start md:justify-center",
        isEven && "md:flex-row-reverse",
      )}
    >
      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border border-green-500 bg-black md:relative md:left-auto md:mx-2">
        {experience.type === "work" ? (
          <BriefcaseIcon className="size-5 stroke-green-500" />
        ) : (
          <GraduationCapIcon className="size-5 stroke-green-500" />
        )}
      </div>

      <Card className="ml-16 w-full border-l-4 border-neutral-800 border-l-green-500 bg-neutral-900 pt-4 pb-3 md:ml-0 md:max-w-md">
        <CardHeader>
          <div>
            <p className="text-sm text-neutral-400">{experience.subtitle}</p>
            <h3 className="text-xl font-bold text-neutral-100">
              {experience.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent>
          <h4 className="mb-2 text-lg">{experience.cardTitle}</h4>
          <div className="text-sm text-neutral-400">
            {formatContent(experience.content)}
          </div>
        </CardContent>

        <CardFooter className="flex items-center border-t border-neutral-800 pt-3 text-xs text-neutral-400">
          <MapPinIcon className="mr-1 h-3 w-3" />
          {experience.location}
        </CardFooter>
      </Card>
    </div>
  );
}
