import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion as m, useScroll } from "motion/react";
import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";

import { cn } from "@/utils/misc";
import { paths } from "@/config/paths";
import { NavLink } from "./nav-link";
import { isActive } from "@/utils/paths";
import { SocialLinks } from "./social-links";

export const FloatingNav = ({
  hideScrollYLimit = 0,
  scrollThreshold = 50,
  isMobile = false,
}) => {
  const [visible, setVisible] = useState<boolean>(isMobile ? true : false);
  const lastScrollY = useRef<number>(0);
  const accumulatedScrollY = useRef<number>(0);

  const pathname = usePathname();
  const { scrollY } = useScroll();
  const visibleYOffset = isMobile ? 20 : 10;

  const navLinkClasses = (path: string) =>
    cn(
      isActive(pathname, path) ? "stroke-green-500" : "stroke-white",
      "size-5 hover:stroke-green-500",
    );

  const handleSearchClick = () => {
    // Implement search
    console.log("search clicked");
  };

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

  return (
    <m.nav
      className="fixed left-1/2 z-20"
      style={{ x: "-50%" }}
      initial={{ y: isMobile ? visibleYOffset : -100 }}
      animate={{ y: visible ? visibleYOffset : -100 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <ul
        aria-label="navigation links"
        className="flex items-center gap-4 py-3 px-4 sm:py-3 sm:px-6 bg-black/50 rounded-full backdrop-blur-sm border border-neutral-700"
      >
        <li>
          <NavLink
            href={paths.home.pathname}
            label="Home"
            icon={LucideHome}
            className="size-5 hover:stroke-green-500"
          />
        </li>
        <li>
          <NavLink
            href={paths.blog.pathname}
            label="Blog"
            icon={LucideBookOpen}
            className={navLinkClasses(paths.blog.pathname)}
          />
        </li>
        <li>
          <NavLink
            href={paths.gallery.pathname}
            label="Gallery"
            icon={LucideCamera}
            className={navLinkClasses(paths.gallery.pathname)}
          />
        </li>
        <li className="flex">
          <button onClick={handleSearchClick}>
            <span className="sr-only">Search</span>
            <LucideSearch className="size-5 hover:stroke-green-500" />
          </button>
        </li>

        <div className="flex h-[24px] gap-4 border-l border-green-500" />

        <SocialLinks />
      </ul>
    </m.nav>
  );
};
