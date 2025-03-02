"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";

import { cn } from "@/utils/misc";
import { isActiveRoute, paths } from "@/config/paths";

export const MobileNav = () => {
  const pathname = usePathname();

  // TODO: Add these to our link styles
  // const navLinkClasses = (paths: string[]) =>
  //   cn(
  //     "size-6 transition-colors duration-200",
  //     isActiveRoute(pathname, paths) ? "stroke-green-500" : "stroke-white",
  //   );

  const handleSearchClick = () => {
    console.log("Search clicked");
  };

  return (
    <nav className="z-50 fixed bottom-0 w-full bg-black/80 backdrop-blur-xs border-t border-neutral-800">
      <ul
        className="flex items-center justify-between max-w-[250px] gap-4 py-3 px-4 sm:py-3 sm:px-6 mx-auto"
        aria-label="navigation links"
      >
        <li className="flex flex-col items-center">
          <Link
            href={paths.home.pathname}
            className="group flex flex-col items-center"
          >
            <LucideHome
              className={cn(
                "size-6 group-hover:stroke-green-500 transition-colors duration-200",
                pathname === paths.home.pathname
                  ? "stroke-green-500"
                  : "stroke-white",
              )}
            />
            <span
              className={cn(
                "text-[10px] mt-1 transition-colors duration-200",
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
                "size-6 group-hover:stroke-green-500 transition-colors duration-200",
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
                "text-[10px] mt-1 transition-colors duration-200",
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
                "size-6 group-hover:stroke-green-500 transition-colors duration-200",
                isActiveRoute(pathname, [paths.gallery.pathname])
                  ? "stroke-green-500"
                  : "stroke-white",
              )}
            />
            <span
              className={cn(
                "text-[10px] mt-1 transition-colors duration-200",
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
            onClick={handleSearchClick}
            className="group flex flex-col items-center"
          >
            <LucideSearch className="size-6 stroke-white group-hover:stroke-green-500 transition-colors duration-200" />
            <span className="text-[10px] mt-1 text-white/70 group-hover:text-green-500 transition-colors duration-200">
              Search
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
