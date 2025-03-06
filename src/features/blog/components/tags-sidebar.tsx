"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { slug } from "github-slugger";
import { title } from "radash";
import {
  LucideLayers,
  LucideTag,
  LucideHash,
  LucideChevronRight,
  FileSearch,
} from "lucide-react";

import { cn } from "@/utils/misc";
import { isActiveRoute, isTagActive, paths } from "@/config/paths";
import tagData from "@/data/tag-data.json" assert { type: "json" };

export const TagsSidebar = () => {
  const tags = Object.entries(tagData);
  const pathname = usePathname();

  return (
    <div className="border-input/50 hidden max-h-fit w-full overflow-hidden rounded-lg border bg-black/50 shadow-lg backdrop-blur-sm sm:block">
      <div className="border-b border-neutral-700/40 bg-gradient-to-b from-neutral-900/90 to-neutral-800/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileSearch className="size-5 text-green-400" />
          <h2 className="font-bold text-white/90">Content Explorer</h2>
        </div>
      </div>

      <div className="px-3 pt-4">
        <Link
          href={paths.blog.pathname}
          className={cn(
            "flex items-center gap-2 rounded-md py-2 pr-3 pl-2 transition-all duration-300",
            isActiveRoute(pathname, [paths.blog.pathname])
              ? "border-l-2 border-green-500 bg-green-500/10 text-green-400"
              : "text-white/80 hover:translate-x-1 hover:bg-neutral-800/50 hover:text-green-400",
          )}
        >
          <LucideLayers className="size-4" />
          <span className="font-bold">All Posts</span>

          {isActiveRoute(pathname, [paths.blog.pathname]) && (
            <LucideChevronRight className="ml-auto size-4" />
          )}
        </Link>
      </div>

      <div className="px-3 py-3">
        <div className="mb-2 flex items-center gap-2 px-2 text-xs tracking-wider text-neutral-400 uppercase">
          <LucideTag className="size-3" />
          <span>Tags</span>
        </div>

        <ul className="space-y-1">
          {tags.map(([tag, count]) => (
            <li key={tag}>
              <Link
                href={paths.tag.getPathname(slug(tag))}
                className={cn(
                  "group flex items-center gap-2 rounded-md py-1.5 pr-3 pl-2 transition-all duration-200",
                  isTagActive(pathname, tag)
                    ? "border-l-2 border-green-500 bg-green-500/10 text-green-400"
                    : "text-neutral-400 hover:translate-x-1 hover:bg-neutral-800/50 hover:text-green-400",
                )}
              >
                <LucideHash className="size-3.5 flex-none opacity-70" />
                <span className="truncate">
                  {tag === "mdx" ? tag.toUpperCase() : title(tag)}
                </span>
                <span className="ml-auto rounded-sm bg-neutral-800/80 px-1.5 py-0.5 font-mono text-xs group-hover:bg-neutral-700/80">
                  {count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
