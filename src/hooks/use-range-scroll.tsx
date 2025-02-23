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

  const resetState = () => {
    setVisible(isMobile ? true : false);
    lastScrollY.current = 0;
  };

  useEffect(() => {
    const handleScroll = (current: number) => {
      if (!isMobile && current <= hideScrollYLimit) {
        setVisible(false);
      }

      const delta = current - lastScrollY.current;

      if (Math.abs(delta) >= scrollThreshold) {
        setVisible(delta <= 0);
        lastScrollY.current = current;
      }
    };

    scrollY.on("change", handleScroll);
    return () => scrollY.clearListeners();
  }, [hideScrollYLimit, scrollThreshold, isMobile, scrollY, lastScrollY]);

  useEffect(() => {
    // Reset visibility and scroll position on route change
    // Force hide nav on desktop when changing routes
    resetState();
  }, [pathname, isMobile, hideScrollYLimit]);

  return { shouldBeVisible: visible };
};
