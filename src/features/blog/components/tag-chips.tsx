import Link from "next/link";

import { slug } from "github-slugger";

import { paths } from "@/config/paths";
import { cn } from "@/utils/misc";

/** `relative z-10` keeps the chips clickable inside the listing card, whose
 *  title link covers the whole row with `after:inset-0`. */
export const TagChips = ({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) => (
  <ul className={cn("flex flex-wrap gap-x-2 gap-y-1.5", className)}>
    {tags.map((tag) => (
      <li key={tag}>
        <Link
          href={paths.tag.getPathname(slug(tag))}
          className="relative z-10 block border border-green-500/25 px-1.5 py-px font-mono text-[10px] tracking-wider text-neutral-300 uppercase transition-colors duration-150 ease-linear hover:border-green-400/60 hover:text-green-300"
        >
          {tag}
        </Link>
      </li>
    ))}
  </ul>
);
