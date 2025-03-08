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
      className="mx-auto flex justify-center bg-black px-8 py-12"
    >
      <div className="max-w-3xl text-neutral-300">
        <div className="pb-6 text-center">
          <m.h2
            className="font-catamaran text-4xl tracking-tight text-neutral-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : -10,
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            G'day. I'm Ash
          </m.h2>
          <m.span
            className="text-sm tracking-wider text-green-500 italic"
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
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>
            I use my passion and skills to build digital products and tooling on
            the web. With my formal education in Business Information Systems
            and experience with retail and experimentation, I have developed a
            keen eye for detail and a strong understanding of connecting
            business needs and outcomes with technical solutions.
          </p>
          <p>
            For the past 3 years, I've been working primarily as a{" "}
            <span className="font-bold text-green-500">Frontend Engineer</span>{" "}
            in Melbourne, Australia, focusing my efforts on developing my skills
            within the JavaScript ecosystem, building user interfaces that are
            both functional and beautiful. The core of my work is in{" "}
            <span className="font-bold text-green-500">React</span>, but I'm
            always playing around with new technologies and frameworks.
          </p>
        </m.div>
      </div>
    </section>
  );
};
