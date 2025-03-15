import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideBookOpen, LucideCamera, LucideSearch } from "lucide-react";

import { cn } from "@/utils/misc";
import { isActiveRoute, paths } from "@/config/paths";
import { NavLink } from "./nav-link";
import { SocialLinks } from "./social-links";
import { FloatingNav } from "./floating-nav";
import { useKBar } from "kbar";

export const NavigationHeader = () => {
  const { query } = useKBar();
  const pathname = usePathname();

  const navLinkClasses = (paths: string[]) =>
    cn(
      "size-5 hover:stroke-green-500",
      isActiveRoute(pathname, paths)
        ? "stroke-green-500"
        : "stroke-neutral-400",
    );

  return (
    <>
      <nav className="h-header hidden place-items-center border-b border-neutral-800 bg-linear-to-t from-black/80 to-neutral-900/80 shadow-md sm:grid">
        <div className="flex w-full max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-green-500">A</span>
              Thompson
            </span>
          </Link>

          <ul className="flex items-center gap-4">
            <li>
              <NavLink
                href={paths.blog.pathname}
                label="Blog"
                icon={LucideBookOpen}
                className={navLinkClasses([
                  paths.blog.pathname,
                  paths.tags.pathname,
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
                <LucideSearch className="size-5 stroke-neutral-400 hover:stroke-green-500" />
              </button>
            </li>

            <div className="h-6 border-r border-neutral-700" />
            <SocialLinks toggleNeutral />
          </ul>
        </div>
      </nav>

      <FloatingNav hideScrollYLimit={100} />
    </>
  );
};
