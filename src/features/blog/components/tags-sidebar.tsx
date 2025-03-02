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
    <div className="hidden sm:block w-full max-h-fit backdrop-blur-sm bg-black/50 border border-input/50 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-800/70 px-4 py-3 border-b border-neutral-700/40">
        <div className="flex items-center gap-2">
          <FileSearch className="text-green-400 size-5" />
          <h2 className="font-bold text-white/90">Content Explorer</h2>
        </div>
      </div>

      <div className="px-3 pt-4">
        <Link
          href={paths.blog.pathname}
          className={cn(
            "flex items-center gap-2 pl-2 pr-3 py-2 rounded-md transition-all duration-300",
            isActiveRoute(pathname, [paths.blog.pathname])
              ? "bg-green-500/10 text-green-400 border-l-2 border-green-500"
              : "hover:bg-neutral-800/50 text-white/80 hover:text-green-400 hover:translate-x-1",
          )}
        >
          <LucideLayers className="size-4" />
          <span className="font-bold">All Posts</span>

          {isActiveRoute(pathname, [paths.blog.pathname]) && (
            <LucideChevronRight className="size-4 ml-auto" />
          )}
        </Link>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2 px-2 mb-2 text-xs text-neutral-400 uppercase tracking-wider">
          <LucideTag className="size-3" />
          <span>Tags</span>
        </div>

        <ul className="space-y-1">
          {tags.map(([tag, count]) => (
            <li key={tag}>
              <Link
                href={paths.tag.getPathname(slug(tag))}
                className={cn(
                  "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md transition-all duration-200 group",
                  isTagActive(pathname, tag)
                    ? "bg-green-500/10 text-green-400 border-l-2 border-green-500"
                    : "hover:bg-neutral-800/50 text-neutral-400 hover:text-green-400 hover:translate-x-1",
                )}
              >
                <LucideHash className="size-3.5 opacity-70" />
                <span>{tag === "mdx" ? tag.toUpperCase() : title(tag)}</span>
                <span className="ml-auto text-xs font-mono bg-neutral-800/80 group-hover:bg-neutral-700/80 px-1.5 py-0.5 rounded">
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
