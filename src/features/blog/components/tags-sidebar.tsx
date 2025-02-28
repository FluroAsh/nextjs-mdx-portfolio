"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { slug } from "github-slugger";

import tagData from "@/data/tag-data.json" assert { type: "json" };
import { cn } from "@/utils/misc";
import { isActiveRoute, isTagActive, paths } from "@/config/paths";
import { title } from "radash";

export const TagsSidebar = () => {
  const tags = Object.entries(tagData);
  const pathname = usePathname();

  return (
    <div className="hidden sm:inline-block w-full max-h-fit bg-neutral-900/60 border border-neutral-700 rounded-md px-6 py-8 ">
      <Link
        href={paths.blog.pathname}
        className={cn(
          isActiveRoute(pathname, [paths.blog.pathname]) && "text-green-500",
          "text-lg font-bold pb-2 uppercase hover:text-green-500 transition-colors duration-75",
        )}
      >
        All Posts
      </Link>

      <ul className="pl-2 leading-7">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <a
              href={paths.tag.getPathname(slug(tag))}
              className={cn(
                "py-0.5 text-sm text-neutral-500 transition-colors duration-75",
                isTagActive(pathname, tag)
                  ? "text-green-500 font-bold"
                  : "hover:text-green-500",
              )}
            >
              <span className="mr-1 text-xs font-mono">({count})</span>
              {tag === "mdx" ? tag.toUpperCase() : title(tag)}{" "}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
