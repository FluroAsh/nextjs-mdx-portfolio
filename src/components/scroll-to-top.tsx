import { motion as m } from "framer-motion";
import { useWindowScroll } from "react-use";
import { ArrowUp } from "lucide-react";

import { cn } from "@/utils/misc";
import { useHasMounted } from "@/hooks/use-has-mounted";

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
  const { y: scrollY } = useWindowScroll();
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const MIN_HEIGHT = 200;
  const isToggledOn = scrollY > MIN_HEIGHT;

  return (
    <m.div
      className={cn(
        isToggledOn ? "opacity-100" : "pointer-events-none opacity-0",
        isMobile ? "right-4 bottom-20" : "right-4 bottom-4",
        "fixed h-[44px] overflow-visible transition-opacity duration-300",
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <button
        className="relative size-11 rounded-full shadow-xs"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <InnerContent />
        <AnimatedBorder />
      </button>
    </m.div>
  );
};
