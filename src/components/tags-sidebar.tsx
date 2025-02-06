"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import tagData from "@/data/tag-data.json" assert { type: "json" };
import { cn } from "@/lib/utils";

export const TagsSidebar = () => {
  const tags = Object.entries(tagData);
  const pathSegments = usePathname().split("/").filter(Boolean);
  const activeTag = pathSegments.length >= 2 ? pathSegments[1] : null;

  return (
    <div className="hidden sm:inline-block w-full max-h-fit bg-neutral-900/60 border border-neutral-700 rounded-sm px-6 py-8 ">
      <Link
        href="/blog"
        className={cn(
          pathSegments.length < 2 && "text-green-500",
          "text-lg font-bold pb-2 uppercase hover:text-green-500 transition-colors duration-75",
        )}
      >
        All Posts
      </Link>

      <ul className="pl-2 leading-7">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <a
              href={`/tags/${tag}`}
              className={cn(
                "py-[2px] text-sm text-neutral-500 uppercase transition-colors duration-75",
                tag !== activeTag && "hover:text-neutral-300",
                tag === activeTag && "text-green-500 font-bold",
              )}
            >
              {tag} <span className="text-sm font-mono">({count})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
