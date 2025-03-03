"use client";

import { motion as m } from "motion/react";
import { useState, useEffect } from "react";
import { throttle } from "radash";

import { cn } from "@/utils/misc";

type CircularGlowProps = {
  size?: number;
  blur?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

const CircularGlow = ({
  size = 150,
  blur = 80,
  top,
  left,
  bottom,
  right,
}: CircularGlowProps) => (
  <div
    className="absolute rounded-full bg-green-500/3"
    style={{
      filter: `blur(${blur}px)`,
      top,
      bottom,
      left,
      right,
      width: size,
      height: size,
    }}
  />
);

export const HeroSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 55);
    };

    window.addEventListener("scroll", throttle({ interval: 50 }, handleScroll));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={cn(
        "h-screen sm:h-[calc(100vh_-_var(--spacing-header))] relative overflow-hidden",
        "from-green-900/5 via-neutral-900 to-black",
      )}
    >
      <CircularGlow size={350} blur={100} top={0} left={0} />
      <CircularGlow size={400} blur={120} bottom={-80} right={-80} />

      {/* Content */}
      <div className="relative z-10 grid place-items-center mx-auto p-8 h-full max-w-7xl">
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
              Ashley
            </m.span>
            <m.span
              className="inline-block ml-2 text-transparent font-extrabold tracking-wide"
              style={{ WebkitTextStroke: "1px rgba(16, 185, 129, 0.6)" }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Thompson
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
                className="text-lg md:text-xl text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Web Developer
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
                className="text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500"
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
                className="text-lg md:text-xl text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                Photographer
              </m.span>
            </div>
          </m.div>
        </m.div>
      </div>

      {/* Scroll down indicator */}
      <m.div
        className={cn(
          "absolute bottom-12 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isScrolled ? 0 : 1, y: 0 }}
      >
        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
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

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};
