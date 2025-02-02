"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import tagData from "@/data/tag-data.json" assert { type: "json" };
import { cn } from "@/lib/utils";

export default function ListLayoutTags({
  children,
}: {
  children: React.ReactNode;
}) {
  const tags = Object.entries(tagData);
  const pathname = usePathname();
  const activeTag = pathname.split("/").pop();

  return (
    <div
      className={cn(
        "grid grid-cols-1 mx-auto px-6 py-8 gap-8 max-w-screen-lg",
        "sm:grid-cols-[240px_minmax(0,auto)]",
      )}
    >
      <div className="hidden sm:inline-block w-full max-h-fit bg-neutral-900/60 border border-neutral-700 rounded-sm px-6 py-8 ">
        <Link
          href="/blog"
          className="text-lg font-bold pb-2 uppercase hover:text-green-500 transition-colors duration-75"
        >
          All Posts
        </Link>

        <ul className="pl-2 leading-7">
          {tags.map(([tag, count]) => (
            <li key={tag}>
              <a
                href={`/tags/${tag}`}
                className={cn(
                  "py-[2px] text-neutral-500 uppercase  transition-colors duration-75 text-sm",
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

      {children}
    </div>
  );
}
