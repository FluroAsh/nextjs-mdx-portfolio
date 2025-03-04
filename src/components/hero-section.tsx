"use client";

import { motion as m } from "motion/react";
import { useState, useEffect } from "react";

import { cn } from "@/utils/misc";
import { author } from "@/data/author";
import { VerticalText } from "./vertical-text";
import { BlurredCircle } from "./blurred-circle";

const ScrollDownIndicator = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 55);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <m.div
      className={cn(
        "absolute bottom-18 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300 cursor-pointer",
        isScrolled ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isScrolled ? 0 : 1, y: 0 }}
    >
      <button
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
        className="flex flex-col items-center gap-2 group"
        aria-label="Scroll down"
      >
        <m.div
          className="w-8 h-12 rounded-full border-2 border-green-500/50 flex justify-center pt-2"
          animate={{
            boxShadow: [
              "0 0 0 rgba(74, 222, 128, 0)",
              "0 0 8px rgba(74, 222, 128, 0.3)",
              "0 0 0 rgba(74, 222, 128, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <m.div
            className="w-1.5 h-3 bg-green-500 rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </m.div>
        <m.svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-green-500/70 group-hover:stroke-green-400 transition-colors"
          animate={{ y: [0, 3, 0] }}
          transition={{ delay: 0.3, duration: 1.5, repeat: Infinity }}
        >
          <path d="m6 9 6 6 6-6" />
        </m.svg>
      </button>
    </m.div>
  );
};

const AuthorHeroTitle = () => {
  const [firstName, lastName] = author.name.split(" ");

  return (
    <m.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <h1 className="font-bold text-6xl md:text-7xl">
        <m.span
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 tracking-wide"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {firstName}
        </m.span>
        <m.span
          className="inline-block ml-2 text-transparent font-extrabold tracking-wide"
          style={{ WebkitTextStroke: "1px rgba(16, 185, 129, 0.6)" }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {lastName}
        </m.span>
      </h1>

      <m.div
        className="relative mt-4 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="inline-flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <m.span
            className="text-neutral-300 text-lg md:text-xl"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Full Stack Developer
          </m.span>

          <m.span
            className="text-green-500/70 text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            •
          </m.span>

          <m.span
            className="text-neutral-300 text-lg md:text-xl"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Designer
          </m.span>

          <m.span
            className="text-green-500/70 text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            •
          </m.span>

          <m.span
            className="text-neutral-300 text-lg md:text-xl"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            Photographer
          </m.span>
        </div>
      </m.div>
    </m.div>
  );
};

export const HeroSection = () => {
  return (
    <section
      className={cn(
        "relative h-dvh sm:h-[calc(100vh_-_var(--spacing-header))] overflow-hidden",
        "from-green-900/5 via-neutral-900 to-black",
      )}
    >
      <BlurredCircle size={350} blur={100} top={0} left={0} />
      <BlurredCircle size={400} blur={120} bottom={-80} right={-80} />

      {/* Content */}
      <div className="relative z-10 grid place-items-center mx-auto p-8 h-full max-w-7xl">
        <div className="flex pointer-events-none select-none absolute bottom-0 left-8 sm:left-16 translate-y-[35px]">
          <VerticalText
            // "Art blends with code"
            text="藝術與代碼融合"
            className="absolute left-4 top-0 mt-3 flex gap-4"
            containerProps={{
              initial: { opacity: 0 },
              animate: { opacity: 0.08 },
              transition: { duration: 1.5, delay: 2.2 },
            }}
          />

          <VerticalText
            // "Program Monkey"
            text="程序猿"
            className="[&_span]:text-[140px] sm:[&_span]:text-[180px]"
            containerProps={{
              initial: { opacity: 0 },
              animate: { opacity: 0.1 },
              transition: { duration: 1.5, delay: 2.2 },
            }}
          />
        </div>

        {/* Top-right corner characters */}
        <m.div
          className="flex gap-4 justify-center items-center pointer-events-none select-none absolute top-12 right-12 md:right-24 z-0 opacity-5"
          style={{ writingMode: "vertical-rl" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 3.2 }}
        >
          <span className="text-green-500 text-8xl font-bold">網</span>
          <span className="text-green-500 text-6xl font-bold">絡</span>
        </m.div>

        <m.div
          className="pointer-events-none select-none absolute top-1/3 right-8 md:right-16 z-0 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.5, delay: 3.5 }}
        >
          <div className="flex flex-col items-end gap-5">
            <span className="text-green-500/80 text-5xl mt-1">
              代碼 {/* Code */}
            </span>
            <span className="text-green-500/80 text-3xl mt-1">
              設計 {/* Design */}
            </span>
          </div>
        </m.div>

        {/* Mid-left binary-inspired pattern */}
        <m.div
          className="pointer-events-none select-none absolute top-1/3 sm:top-1/4 left-8 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 3.8 }}
        >
          <div className="flex flex-col items-start">
            <div className="flex gap-3">
              {/* Innovation */}
              <span className="text-green-500/70 text-4xl font-mono">創</span>
              <span className="text-green-500/70 text-4xl font-mono">新</span>
            </div>
            <div className="flex gap-3 ml-6 mt-2">
              {/* Thinking */}
              <span className="text-green-500/70 text-2xl font-mono">思</span>
              <span className="text-green-500/70 text-2xl font-mono">維</span>
            </div>
          </div>
        </m.div>

        {/* Subtle dots pattern with characters */}
        <div className="absolute inset-0 z-0">
          <m.div
            className="absolute top-[20%] left-[25%] opacity-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4 }}
          >
            {/* Technique */}
            <span className="text-green-500/70 text-xl">技</span>
          </m.div>
          <m.div
            className="absolute top-[15%] left-[55%] opacity-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.2 }}
          >
            {/* Technique */}
            <span className="text-green-500/70 text-xl">術</span>
          </m.div>
          <m.div
            className="absolute top-[65%] right-[30%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.4 }}
          >
            {/* Art */}
            <span className="text-green-500/70 text-xl">藝</span>
          </m.div>
          <m.div
            className="absolute top-[67.5%] sm:top-[70%] right-[15%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.6 }}
          >
            {/* Technique */}
            <span className="text-green-500/70 text-xl">術</span>
          </m.div>
        </div>

        <m.div
          className="flex pointer-events-none select-none absolute top-1/4 right-12 z-0"
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.5, delay: 3.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* Fusion of art and code */}
            {"藝術與代碼融合".split("").map((char, index) => (
              <span
                key={index}
                className="text-green-500/80 text-2xl font-bold"
              >
                {char}
              </span>
            ))}
          </div>
        </m.div>

        {/* Learning knows no bounds */}
        <VerticalText
          text="學無止境"
          className="absolute -bottom-4 right-5 sm:right-[17.5%] transform [&_span]:text-[80px]"
          containerProps={{
            initial: { opacity: 0 },
            animate: { opacity: 0.07 },
            transition: { duration: 1.5, delay: 2.2 },
          }}
        />

        <AuthorHeroTitle />
      </div>

      <ScrollDownIndicator />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};
