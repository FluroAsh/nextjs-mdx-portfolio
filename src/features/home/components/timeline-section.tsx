"use client";

import { isValidElement } from "react";

import {
  BriefcaseIcon,
  ExternalLink,
  GraduationCapIcon,
  MapPinIcon,
} from "lucide-react";
import { motion as m } from "motion/react";

import { CustomLink } from "@/features/blog/components/mdx/link";
import { cn } from "@/utils/misc";

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
    link: "https://liquipedia.net/overwatch/Fluro",
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
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium tracking-wider text-green-400 backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          TIMELINE
        </div>

        <h2 className="mb-4 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-5xl">
          The Journey So Far...
        </h2>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-400 lg:text-lg">
          Here&apos;s a brief overview of my professional and educational
          journey through the years.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - hidden on mobile, shown on desktop */}
        <div className="absolute top-0 left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-green-500 via-green-500/50 to-transparent md:block" />

        {/* Timeline Items */}
        <div className="space-y-12 md:space-y-16">
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
      <p key={i} className={cn(i > 0 ? "mt-3" : "")}>
        {paragraph}
      </p>
    ));
  }

  return content;
};

type ItemProps = {
  experience: (typeof experiences)[number];
  index: number;
};

function TimelineItem({ experience, index }: ItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <m.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Mobile Layout */}
      <div className="flex items-start gap-4 md:hidden">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-500/5 shadow-lg shadow-green-500/20 backdrop-blur-sm">
          {experience.type === "work" ? (
            <BriefcaseIcon className="size-5 stroke-green-400" />
          ) : (
            <GraduationCapIcon className="size-5 stroke-green-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-800/30 px-3 py-1 text-xs font-medium text-neutral-400 backdrop-blur-sm">
            {experience.subtitle}
          </div>
          <h3 className="mb-1 text-xl font-bold text-neutral-100">
            {experience.title}
          </h3>
          <p className="mb-4 text-sm font-medium text-green-400">
            {experience.cardTitle}
          </p>

          <div className="group relative overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-4 text-sm leading-relaxed text-neutral-300">
                {formatContent(experience.content)}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <MapPinIcon className="size-3.5" />
                  <span>{experience.location}</span>
                </div>

                {experience.link && (
                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-green-500 transition-colors hover:text-green-400"
                  >
                    <span>View</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="relative mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-start gap-6">
          {/* Left Column */}
          <div className={cn("flex", isLeft ? "justify-end" : "justify-start")}>
            {isLeft ? (
              <div className="w-full text-right">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-800/30 px-3 py-1 text-xs font-medium text-neutral-400 backdrop-blur-sm">
                  {experience.subtitle}
                </div>
                <h3 className="mb-1 text-2xl font-bold text-neutral-100">
                  {experience.title}
                </h3>
                <p className="text-sm font-medium text-green-400">
                  {experience.cardTitle}
                </p>
              </div>
            ) : (
              <div className="group relative w-full overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-4 text-sm leading-relaxed text-neutral-300">
                    {formatContent(experience.content)}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPinIcon className="size-3.5" />
                      <span>{experience.location}</span>
                    </div>

                    {experience.link && (
                      <a
                        href={experience.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-green-500 transition-colors hover:text-green-400"
                      >
                        <span>View</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Center Icon */}
          <div className="flex items-start justify-center pt-2">
            <div className="flex size-14 items-center justify-center rounded-xl border border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-500/5 shadow-lg shadow-green-500/20 backdrop-blur-sm">
              {experience.type === "work" ? (
                <BriefcaseIcon className="size-6 stroke-green-400" />
              ) : (
                <GraduationCapIcon className="size-6 stroke-green-400" />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={cn("flex", isLeft ? "justify-start" : "justify-end")}>
            {isLeft ? (
              <div className="group relative w-full overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-4 text-sm leading-relaxed text-neutral-300">
                    {formatContent(experience.content)}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPinIcon className="size-3.5" />
                      <span>{experience.location}</span>
                    </div>

                    {experience.link && (
                      <a
                        href={experience.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-green-500 transition-colors hover:text-green-400"
                      >
                        <span>View</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ) : (
              <div className="w-full">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-800/30 px-3 py-1 text-xs font-medium text-neutral-400 backdrop-blur-sm">
                  {experience.subtitle}
                </div>
                <h3 className="mb-1 text-2xl font-bold text-neutral-100">
                  {experience.title}
                </h3>
                <p className="text-sm font-medium text-green-400">
                  {experience.cardTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}
