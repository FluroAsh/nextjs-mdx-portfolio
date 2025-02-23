import { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const useRangeScroll = (
  pathname: string,
  isMobile: boolean,
  scrollY: MotionValue<number>,
  scrollThreshold = 50,
  hideScrollYLimit = 0,
) => {
  const [visible, setVisible] = useState<boolean>(isMobile ? true : false);
  const lastScrollY = useRef<number>(0);
  const accumulatedScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = (current: number) => {
      const scrollDiff = Math.abs(current - lastScrollY.current);
      accumulatedScrollY.current += scrollDiff;

      if (accumulatedScrollY.current >= scrollThreshold) {
        setVisible(current < lastScrollY.current); // Hide when scrolling down, otherwise show
        accumulatedScrollY.current = 0;
      }

      // Hide nav on desktop, ALWAYS, when below scrollThreshold
      if (!isMobile && lastScrollY.current <= hideScrollYLimit) {
        setVisible(false);
      }

      lastScrollY.current = current;
    };

    scrollY.on("change", handleScroll);
    return () => scrollY.clearListeners();
  }, [hideScrollYLimit, scrollThreshold, isMobile, scrollY, lastScrollY]);

  useEffect(() => {
    // Reset visibility and scroll position on route change
    // Force hide nav on desktop when changing routes
    setVisible(isMobile ? true : false);
    lastScrollY.current = 0;

    // Force hide nav on desktop when changing routes
    if (!isMobile) setVisible(false);
  }, [pathname, isMobile, hideScrollYLimit]);

  return { shouldBeVisible: visible };
};
