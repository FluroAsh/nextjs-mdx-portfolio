"use client";

import { motion as m, useInView } from "motion/react";
import { useRef } from "react";

import { defaultViewMargin } from "@/lib/constants";

export const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    margin: defaultViewMargin,
  });

  return (
    <section
      ref={ref}
      className="relative mx-auto justify-center bg-black px-8 pt-10 pb-12"
    >
      <div className="absolute -bottom-4 left-0 h-32 w-full translate-y-1/2 bg-gradient-to-b from-black via-black to-transparent" />
      <div className="pb-6 text-center">
        <m.h2
          className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : -10,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          G&apos;day. I&apos;m Ash
        </m.h2>
        <m.span
          className="text-xs text-neutral-300 italic"
          initial={{ opacity: 0, x: 10 }}
          animate={{
            opacity: isInView ? 1 : 0,
            x: isInView ? 0 : 10,
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Ashley Thompson
        </m.span>
      </div>

      <m.div
        className="mx-auto max-w-4xl space-y-4 text-neutral-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-sm">
          I use my passion and skills to build digital products and tooling on
          the web. With my formal education in Business Information Systems and
          experience with retail and experimentation, I have developed a keen
          eye for detail and a strong understanding of connecting business needs
          and outcomes with technical solutions.
        </p>
        <p className="text-sm">
          For the past 3 years, I&apos;ve been working primarily as a{" "}
          <span className="font-bold text-green-500">Frontend Engineer</span> in
          Melbourne, Australia, focusing my efforts on developing my skills
          within the JavaScript ecosystem, building user interfaces that are
          both functional and beautiful. The core of my work is in{" "}
          <span className="font-bold text-green-500">React</span>, but I&apos;m
          always playing around with new technologies and frameworks.
        </p>
      </m.div>
    </section>
  );
};
