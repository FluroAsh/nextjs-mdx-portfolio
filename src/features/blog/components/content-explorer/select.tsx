"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paths } from "@/config/paths";
import { sortedTags } from "@/data/tags";

import { type ExplorerCounts, ExplorerHeader } from "./header";

const ALL_POSTS_SLUG = "all-posts";

const OPTIONS = [
  { value: ALL_POSTS_SLUG, label: "All posts" },
  ...sortedTags.map(({ tag, label }) => ({ value: tag, label })),
];

export const ExplorerSelect = ({ resultCount, totalPosts }: ExplorerCounts) => {
  const router = useRouter();
  const pathname = usePathname();
  const [firstSegment, secondSegment] = pathname.split("/").filter(Boolean);

  const handleSelection = (value: string) =>
    router.push(
      value === ALL_POSTS_SLUG
        ? paths.blog.pathname
        : paths.tag.getPathname(value),
    );

  return (
    <div className="md:hidden">
      <ExplorerHeader resultCount={resultCount} totalPosts={totalPosts} />

      <Select
        defaultValue={firstSegment === "blog" ? ALL_POSTS_SLUG : secondSegment}
        onValueChange={handleSelection}
      >
        <SelectTrigger
          aria-label="Filter posts by tag"
          className="mt-3 h-11 rounded-none border-green-500/25 bg-transparent px-3 font-mono text-[13px] text-neutral-200 shadow-none"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="rounded-none border-green-500/25 bg-black/90">
          {OPTIONS.map(({ value, label }) => (
            <SelectItem
              key={value}
              value={value}
              className="rounded-none font-mono text-[13px] focus:bg-green-500/10 focus:text-green-300"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
