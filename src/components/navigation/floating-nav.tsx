import { usePathname } from "next/navigation";

import { useKBar } from "kbar";
import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";
import { motion as m, useScroll } from "motion/react";

import { isActiveRoute, paths } from "@/config/paths";
import { useRangeScroll } from "@/hooks/use-range-scroll";
import { cn } from "@/utils/misc";

import { NavLink } from "./nav-link";
import { SocialLinks } from "./social-links";

export const FloatingNav = ({
  hideScrollYLimit = 0,
  scrollThreshold = 50,
  isMobile = false,
}) => {
  const pathname = usePathname();
  const { query } = useKBar();
  const { scrollY } = useScroll();
  const { shouldBeVisible } = useRangeScroll(
    false,
    scrollY,
    scrollThreshold,
    hideScrollYLimit,
  );

  const navLinkClasses = (paths: string[]) =>
    cn(
      "size-5 hover:stroke-green-500",
      isActiveRoute(pathname, paths) ? "stroke-green-500" : "stroke-white",
    );

  return (
    <m.nav
      className="fixed left-1/2 z-20"
      style={{ x: "-50%" }}
      initial={{ y: isMobile ? 10 : -100 }}
      animate={{ y: shouldBeVisible ? 10 : -100 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <ul
        aria-label="navigation links"
        className="flex items-center gap-4 rounded-full border border-neutral-800 bg-black/80 px-4 py-3 backdrop-blur-xs sm:px-6 sm:py-3"
      >
        <li>
          <NavLink
            href={paths.home.pathname}
            label="Home"
            icon={LucideHome}
            className={cn(
              pathname === paths.home.pathname
                ? "stroke-green-500"
                : "stroke-white",
              "size-5 hover:stroke-green-500",
            )}
          />
        </li>
        <li>
          <NavLink
            href={paths.blog.pathname}
            label="Blog"
            icon={LucideBookOpen}
            className={navLinkClasses([
              paths.tags.pathname,
              paths.blog.pathname,
            ])}
          />
        </li>
        <li>
          <NavLink
            href={paths.gallery.pathname}
            label="Gallery"
            icon={LucideCamera}
            className={navLinkClasses([paths.gallery.pathname])}
          />
        </li>
        <li className="flex">
          <button onClick={() => query.toggle()}>
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
