"use client";

import { useEffect, useState } from "react";

import { motion as m } from "motion/react";

import { BlurredCircle } from "@/components/blurred-circle";
import { VerticalText } from "@/components/vertical-text";
import { author } from "@/data/author";
import { cn } from "@/utils/misc";

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
        "absolute bottom-18 left-1/2 z-10 -translate-x-1/2 cursor-pointer transition-opacity duration-300 sm:bottom-4",
        isScrolled ? "opacity-0" : "opacity-100",
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
        className="group flex flex-col items-center gap-2"
        aria-label="Scroll down"
      >
        <m.div
          className="flex h-12 w-8 justify-center rounded-full border-2 border-green-500/50 pt-2"
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
            className="h-3 w-1.5 rounded-full bg-green-500"
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
          className="stroke-green-500/70 transition-colors group-hover:stroke-green-400"
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
  const roles = [
    { title: "Full Stack Developer", icon: "📚" },
    { title: "Designer", icon: "🎨" },
    { title: "Photographer", icon: "📸" },
  ];

  return (
    <m.div
      className="text-center select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <h1 className="text-6xl font-bold md:text-7xl">
        <m.span
          className="inline-block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text tracking-wide text-transparent"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {firstName}
        </m.span>
        <m.span
          className="ml-2 font-bold tracking-wide text-transparent"
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
        {/* Mobile Layout (stacked) */}
        <div className="flex flex-col items-center gap-2 sm:hidden">
          {roles.map(({ title, icon }, i) => (
            <m.div
              key={title}
              className="relative mb-1 flex items-center backdrop-blur-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            >
              {i < roles.length - 1 && (
                <m.div
                  className="absolute -bottom-3 left-1/2 h-3 w-px bg-green-500/40"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.8 + i * 0.2, duration: 0.5 }}
                />
              )}

              <span
                className={cn(
                  "relative px-3 py-0.5 text-lg",
                  "rounded-md border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/5 text-green-400",
                )}
              >
                <span className="mr-2 text-sm opacity-80">{icon}</span>
                <span className="text-sm">{title}</span>
              </span>
            </m.div>
          ))}
        </div>

        {/* Desktop Layout (Horizontal) */}
        <div className="hidden items-center justify-center sm:flex">
          {roles.map(({ title, icon }, i) => (
            <m.div
              key={`desktop-${title}`}
              className="relative flex items-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            >
              <span
                className={cn(
                  "relative px-3 py-0.5 backdrop-blur-sm",
                  "rounded-md border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/5 text-green-400",
                )}
              >
                <span className="mr-1.5 text-sm opacity-60">{icon}</span>
                <span className="text-sm">{title}</span>
              </span>

              {i < roles.length - 1 && (
                <m.div
                  className="h-px w-8 bg-green-500/40"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 1.8 + i * 0.2, duration: 0.5 }}
                  style={{ transformOrigin: "left center" }}
                />
              )}
            </m.div>
          ))}
        </div>
      </m.div>
    </m.div>
  );
};

export const HeroSection = () => {
  return (
    <section
      className={cn(
        "relative h-dvh overflow-hidden sm:h-[calc(100vh_-_var(--spacing-header))]",
        "from-green-900/5 via-neutral-900 to-black",
      )}
    >
      <BlurredCircle size={350} blur={100} top={0} left={0} />
      <BlurredCircle size={400} blur={120} bottom={-80} right={-80} />

      <div className="relative mx-auto grid h-full max-w-7xl place-items-center p-8">
        <div className="absolute bottom-0 left-4 flex translate-y-[35px] select-none sm:left-16">
          <VerticalText
            // "Art blends with code"
            text="藝術與代碼融合"
            className="absolute top-0 left-4 mt-3 flex gap-4"
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
          className="absolute top-12 right-12 z-0 flex items-center justify-center gap-4 opacity-5 select-none md:right-24"
          style={{ writingMode: "vertical-rl" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 3.2 }}
        >
          <span className="text-7xl font-bold text-green-500 sm:text-8xl">
            網
          </span>
          <span className="text-5xl font-bold text-green-500 sm:text-6xl">
            絡
          </span>
        </m.div>

        <m.div
          className="absolute top-1/3 right-8 z-0 hidden select-none md:right-16 md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.5, delay: 3.5 }}
        >
          <div className="flex flex-col items-end gap-5">
            <span className="mt-1 text-5xl text-green-500/80">
              代碼 {/* Code */}
            </span>
            <span className="mt-1 text-3xl text-green-500/80">
              設計 {/* Design */}
            </span>
          </div>
        </m.div>

        <m.div
          className="absolute top-[200px] right-10 z-0 flex select-none sm:top-[27.5%] sm:right-12"
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
                className="text-2xl font-bold text-green-500/80"
              >
                {char}
              </span>
            ))}
          </div>
        </m.div>

        {/* Top-left corner characters */}
        <m.div
          className="absolute top-27 left-8 z-0 select-none sm:top-1/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 3.8 }}
        >
          <div className="flex flex-col">
            <div className="flex gap-4">
              {/* Innovation */}
              <span className="text-3xl text-green-500/70 sm:text-4xl">創</span>
              <span className="text-3xl text-green-500/70 sm:text-4xl">新</span>
            </div>
            <div className="mt-2 ml-6 flex gap-3 sm:mt-4">
              {/* Thinking */}
              <span className="text-xl text-green-500/70 sm:text-2xl">思</span>
              <span className="text-xl text-green-500/70 sm:text-2xl">維</span>
            </div>
          </div>
        </m.div>

        {/* Subtle dots pattern with characters */}
        <div className="absolute inset-0 select-none">
          <m.div
            className="absolute top-16 left-[25%] opacity-8 sm:top-[20%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4 }}
          >
            {/* Technique */}
            <span className="text-xl text-green-500/70">技</span>
          </m.div>
          <m.div
            className="absolute top-[15%] left-[55%] opacity-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.2 }}
          >
            {/* Technique */}
            <span className="text-xl text-green-500/70">術</span>
          </m.div>
          <m.div
            className="absolute top-[65%] right-[30%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.4 }}
          >
            {/* Art */}
            <span className="text-xl text-green-500/70">藝</span>
          </m.div>
          <m.div
            className="absolute right-[15%] bottom-[40%] sm:top-[70%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 4.6 }}
          >
            {/* Technique */}
            <span className="text-xl text-green-500/70">術</span>
          </m.div>
        </div>

        {/* Learning knows no bounds */}
        <VerticalText
          text="學無止境"
          className="absolute right-5 -bottom-4 transform sm:right-[17.5%] [&_span]:text-[80px]"
          containerProps={{
            initial: { opacity: 0 },
            animate: { opacity: 0.07 },
            transition: { duration: 1.5, delay: 2.2 },
          }}
        />

        <AuthorHeroTitle />
      </div>

      <ScrollDownIndicator />
      <div className="absolute right-0 bottom-0 left-0 h-18 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};
