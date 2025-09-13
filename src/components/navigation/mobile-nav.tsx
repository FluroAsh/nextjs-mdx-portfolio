"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useKBar } from "kbar";
import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";
import { useScroll } from "motion/react";

import { isActiveRoute, paths } from "@/config/paths";
import { useRangeScroll } from "@/hooks/use-range-scroll";
import { cn } from "@/utils/misc";

export const MobileNav = () => {
  const pathname = usePathname();
  const { query } = useKBar();

  const { scrollY } = useScroll();
  const { shouldBeVisible } = useRangeScroll(true, scrollY, 50, 0);

  // TODO: Add these to our link styles
  // const navLinkClasses = (paths: string[]) =>
  //   cn(
  //     "size-6 transition-colors duration-200",
  //     isActiveRoute(pathname, paths) ? "stroke-green-500" : "stroke-white",
  //   );

  return (
    <nav
      className={cn(
        "fixed bottom-0 z-50 w-full border-t border-neutral-800 bg-black/80 backdrop-blur-xs transition-transform duration-300",
        shouldBeVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <ul
        className="mx-auto flex max-w-[250px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3"
        aria-label="navigation links"
      >
        <li className="flex flex-col items-center">
          <Link
            href={paths.home.pathname}
            className="group flex flex-col items-center"
          >
            <LucideHome
              className={cn(
                "size-6 transition-colors duration-200 group-hover:stroke-green-500",
                pathname === paths.home.pathname
                  ? "stroke-green-500"
                  : "stroke-white",
              )}
            />
            <span
              className={cn(
                "mt-1 text-[10px] transition-colors duration-200",
                pathname === paths.home.pathname
                  ? "text-green-500"
                  : "text-white/70",
                "group-hover:text-green-500",
              )}
            >
              Home
            </span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <Link
            href={paths.blog.pathname}
            className="group flex flex-col items-center"
          >
            <LucideBookOpen
              className={cn(
                "size-6 transition-colors duration-200 group-hover:stroke-green-500",
                isActiveRoute(pathname, [
                  paths.tags.pathname,
                  paths.blog.pathname,
                ])
                  ? "stroke-green-500"
                  : "stroke-white",
              )}
            />
            <span
              className={cn(
                "mt-1 text-[10px] transition-colors duration-200",
                isActiveRoute(pathname, [
                  paths.tags.pathname,
                  paths.blog.pathname,
                ])
                  ? "text-green-500"
                  : "text-white/70",
                "group-hover:text-green-500",
              )}
            >
              Blog
            </span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <Link
            href={paths.gallery.pathname}
            className="group flex flex-col items-center"
          >
            <LucideCamera
              className={cn(
                "size-6 transition-colors duration-200 group-hover:stroke-green-500",
                isActiveRoute(pathname, [paths.gallery.pathname])
                  ? "stroke-green-500"
                  : "stroke-white",
              )}
            />
            <span
              className={cn(
                "mt-1 text-[10px] transition-colors duration-200",
                isActiveRoute(pathname, [paths.gallery.pathname])
                  ? "text-green-500"
                  : "text-white/70",
                "group-hover:text-green-500",
              )}
            >
              Gallery
            </span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <button
            onClick={() => query.toggle()}
            className="group flex flex-col items-center"
          >
            <LucideSearch className="size-6 stroke-white transition-colors duration-200 group-hover:stroke-green-500" />
            <span className="mt-1 text-[10px] text-white/70 transition-colors duration-200 group-hover:text-green-500">
              Search
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
