import { motion as m, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { cn } from "@/utils/misc";
import { useRangeScroll } from "@/hooks/use-range-scroll";

const AnimatedBorder = () => {
  return (
    <div
      className="animate-rotate-conic-border absolute inset-0 -z-10 transform-gpu rounded-full"
      style={{
        background:
          "conic-gradient(from 0deg, #00B846, #006927, #006927, #00B846)",
      }}
    />
  );
};

const InnerContent = () => {
  return (
    <div className="absolute inset-0 z-10 flex scale-90 transform items-center justify-center rounded-full bg-neutral-900">
      <ArrowUp size={20} />
    </div>
  );
};

export const ScrollToTop = ({ isMobile }: { isMobile: boolean }) => {
  const { scrollY } = useScroll();
  const { shouldBeVisible, lastScrollY } = useRangeScroll(
    isMobile,
    scrollY,
    50,
    200,
  );

  return (
    <m.div
      className={cn(
        // TODO: Refactor lastScrollY >= check into useRangeScroll
        lastScrollY >= 200 && shouldBeVisible
          ? "opacity-100"
          : "pointer-events-none opacity-0",
        isMobile ? "right-4 bottom-20" : "right-4 bottom-4",
        "fixed h-[44px] overflow-visible transition-opacity duration-300",
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <button
        className="relative size-12 rounded-full"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <InnerContent />
        <AnimatedBorder />
      </button>
    </m.div>
  );
};
