import { motion as m } from "framer-motion";
import { useWindowScroll } from "react-use";
import { ArrowUp } from "lucide-react";

import { cn } from "@/utils/misc";
import { useHasMounted } from "@/hooks/use-has-mounted";

const AnimatedBorder = () => {
  return (
    <div
      className="absolute inset-0 rounded-full -z-10 transform-gpu animate-rotate-conic-border"
      style={{
        background:
          "conic-gradient(from 0deg, #00B846, #006927, #006927, #00B846)",
      }}
    />
  );
};

const InnerContent = () => {
  return (
    <div className="flex items-center justify-center absolute inset-0 bg-neutral-900 z-10 rounded-full transform scale-90">
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
        isToggledOn ? "opacity-100" : "opacity-0 pointer-events-none",
        isMobile ? "bottom-20 right-4" : "bottom-4 right-4",
        "h-[44px] fixed overflow-visible transition-opacity duration-300",
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <button
        className="shadow-xs rounded-full relative size-11"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <InnerContent />
        <AnimatedBorder />
      </button>
    </m.div>
  );
};
