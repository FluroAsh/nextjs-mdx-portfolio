"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActiveRoute, isTagActive, paths } from "@/config/paths";
import { sortedTags } from "@/data/tags";
import { cn, zeroPad } from "@/utils/misc";

import { type ExplorerCounts, ExplorerHeader } from "./header";

type FilterRowProps = {
  href: string;
  label: string;
  count: number;
  isActive: boolean;
};

const FilterRow = ({ href, label, count, isActive }: FilterRowProps) => (
  <li>
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-baseline border-l-2 py-1.5 pr-1 pl-2.5",
        "font-mono text-[13px] transition-colors duration-150 ease-linear",
        isActive
          ? "border-green-400 text-green-300"
          : "border-transparent text-neutral-300 hover:border-green-500/30 hover:text-green-300",
      )}
    >
      <span className="truncate">{label}</span>

      {/* Without the offset the dots sit on the row's bottom edge. */}
      <span
        aria-hidden
        className="mx-2 min-w-4 flex-1 translate-y-[-0.3em] self-center border-b border-dotted border-green-500/30"
      />

      <span className="text-[10px] tracking-wider text-green-500/70 tabular-nums">
        {zeroPad(count)}
      </span>
    </Link>
  </li>
);

export const ExplorerColumn = ({ resultCount, totalPosts }: ExplorerCounts) => {
  const pathname = usePathname();

  return (
    <nav
      aria-labelledby="tag-index"
      className="hidden max-h-fit self-start md:sticky md:top-8 md:block"
    >
      <ExplorerHeader
        id="tag-index"
        resultCount={resultCount}
        totalPosts={totalPosts}
      />

      <ul className="mt-3 space-y-px">
        <FilterRow
          href={paths.blog.pathname}
          label="ALL POSTS"
          count={totalPosts}
          isActive={isActiveRoute(pathname, [paths.blog.pathname])}
        />

        {/* Uppercased here, not in the select — deliberately different. */}
        {sortedTags.map(({ tag, label, count }) => (
          <FilterRow
            key={tag}
            href={paths.tag.getPathname(tag)}
            label={label.toUpperCase()}
            count={count}
            isActive={isTagActive(pathname, tag)}
          />
        ))}
      </ul>
    </nav>
  );
};
