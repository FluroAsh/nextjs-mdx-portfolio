"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/misc";

/**
 * An endlessly scrolling row. Renders its children twice and moves each copy by
 * its own width — see `animations.css` for why it is done that way.
 *
 * **Takes a speed, not a duration.** The duration is worked out from the
 * measured width, so adding content makes a loop take longer rather than making
 * the row move faster. Two rows sharing a duration end up at different speeds
 * whenever they hold different amounts of content.
 */

/** Pixels per second. Fast enough to read — the hero's titles set the limit. */
const DEFAULT_SPEED = 48;

/** Used until the row is measured; replaced on mount. */
const FALLBACK_DURATION = 30;

export const Marquee = ({
  children,
  speed = DEFAULT_SPEED,
  reverse = false,
  className,
  copyClassName,
  ...rest
}: {
  children: React.ReactNode;
  /** Pixels per second. */
  speed?: number;
  /** Travel toward the right instead of the left. */
  reverse?: boolean;
  className?: string;
  /** Applied to both copies. */
  copyClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [gap, setGap] = useState(0);
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const copy = copyRef.current;
    const root = rootRef.current;
    if (!copy || !root) return;

    const measure = () => {
      // Not `offsetWidth`, which rounds to whole pixels — this has to match
      // the transform exactly.
      const width = copy.getBoundingClientRect().width;
      if (width <= 0) return;

      // Any gap between the copies has to be included or the loop lands short.
      // Read from the DOM rather than passed in, so adding a `gap` class can't
      // break it.
      const columnGap = parseFloat(getComputedStyle(root).columnGap) || 0;
      setGap(columnGap);

      // Changing `animation-duration` while it is running restarts progress
      // from elapsed time, which shows up as a jump. A font loading in is
      // enough to trigger it.
      setDuration((previous) => {
        const next = (width + columnGap) / speed;
        return Math.abs(next - previous) < 0.25 ? previous : next;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    observer.observe(root);
    return () => observer.disconnect();
  }, [speed]);

  // Off-screen it would keep animating for nobody.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: "100px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("marquee", className)}
      data-reverse={reverse || undefined}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": `${gap}px`,
          "--marquee-state": isOnScreen ? "running" : "paused",
        } as React.CSSProperties
      }
      {...rest}
    >
      <div ref={copyRef} className={cn("marquee__copy", copyClassName)}>
        {children}
      </div>

      {/* Hidden from screen readers, or every item gets announced twice. */}
      <div aria-hidden className={cn("marquee__copy", copyClassName)}>
        {children}
      </div>
    </div>
  );
};
