import { ArrowUp } from "lucide-react";
import { motion as m, useScroll } from "motion/react";

import { useRangeScroll } from "@/hooks/use-range-scroll";
import { cn } from "@/utils/misc";

const CONIC = "conic-gradient(from 0deg, #00B846, #006927, #006927, #00B846)";

/** Marks this as the action, not a third drawer trigger. Lighter mixes only
 *  separate side by side, and on most pages this button is alone. */
const FACE_FILL =
  "color-mix(in oklab, var(--color-green-500) 26%, var(--surface-page))";

/**
 * Oversized so the sweep still covers the chamfer's corners at 45°, where a
 * rotating square cuts closest to centre. Sized with `inset` rather than a
 * translate — the keyframes animate `transform` and would overwrite it.
 */
const AnimatedBorder = () => (
  <span
    aria-hidden
    className="animate-rotate-conic-border absolute -inset-[25%] transform-gpu"
    style={{ background: CONIC }}
  />
);

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
        lastScrollY >= 200 && shouldBeVisible
          ? "opacity-100"
          : "pointer-events-none opacity-0",
        // Baseline shared with the blog drawer triggers; clears the mobile nav.
        "right-4 bottom-20 sm:bottom-4",
        // Above the chapter rail (30) and scanline planes (20), below the
        // nav and overlays (50).
        "fixed z-40 size-12 transition-opacity duration-300",
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      {/* The face inset is what is left of the sweep. At 1px it was invisible. */}
      <button
        className="clip-chamfer relative size-12"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <AnimatedBorder />

        <span
          className="clip-chamfer absolute inset-[2px] flex items-center justify-center"
          style={{ background: FACE_FILL }}
        >
          {/* Matches the drawer triggers — the fill is the only difference. */}
          <ArrowUp size={18} className="stroke-green-400" />
        </span>
      </button>
    </m.div>
  );
};
