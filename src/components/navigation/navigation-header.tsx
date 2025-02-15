import { LucideBookOpen, LucideCamera, LucideSearch } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/misc";
import { isActive } from "@/utils/paths";
import { author } from "@/data/author";
import { paths } from "@/config/paths";
import { FloatingNav } from "./floating-nav";
import { NavLink } from "./nav-link";

export const NavigationHeader = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="grid place-items-center bg-neutral-900 h-[55px] border-b border-neutral-700">
        <div className="flex items-center justify-between w-full max-w-screen-lg px-4">
          <a href="/" className="flex items-center gap-2">
            {/* <img
              src="/static/images/ash-logo.svg"
              alt="Ash Logo"
              className="w-8 h-8"
            /> */}
            <span className="font-bold text-lg">
              <span className="text-green-500">A</span>
              Thompson
            </span>
          </a>

          <ul className="flex items-center gap-4">
            <li>
              <NavLink
                href={paths.blog.getPathname()}
                label="Blog"
                icon={LucideBookOpen}
                className={cn(
                  isActive(pathname, paths.blog.getPathname())
                    ? "stroke-green-500"
                    : "stroke-neutral-400",
                  "size-5 hover:stroke-green-500",
                )}
              />
            </li>
            <li>
              <NavLink
                href={paths.gallery.getPathname()}
                label="Gallery"
                icon={LucideCamera}
                className={cn(
                  isActive(pathname, paths.gallery.getPathname())
                    ? "stroke-green-500"
                    : "stroke-neutral-400",
                  "size-5 hover:stroke-green-500",
                )}
              />
            </li>
            <li>
              <NavLink
                href="#"
                label="Search"
                icon={LucideSearch}
                className="size-5 stroke-neutral-400 hover:stroke-green-500"
              />
            </li>

            <div className="border-r border-neutral-700 h-6" />

            {author.socials.map(({ network, href, Icon: SocialIcon }) => (
              <li key={network}>
                <NavLink
                  href={href}
                  label={network}
                  icon={SocialIcon}
                  className={cn(
                    "size-5",
                    network === "X"
                      ? "fill-neutral-400 hover:fill-green-500"
                      : "stroke-neutral-400 hover:stroke-green-500",
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <FloatingNav hideScrollYLimit={100} />
    </>
  );
};
