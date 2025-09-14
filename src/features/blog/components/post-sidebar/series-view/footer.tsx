import Link from "next/link";

import { LucideChevronLeft } from "lucide-react";

import { paths } from "@/config/paths";

export const SeriesFooter = ({ onClick }: { onClick?: () => void }) => (
  <div className="mt-4">
    <Link
      className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors duration-75 hover:text-green-500"
      href={paths.blog}
      onClick={onClick}
    >
      <LucideChevronLeft className="size-4 transition-transform duration-75 group-hover:-translate-x-1" />
      <span className="mt-[1px] leading-none">All Posts</span>
    </Link>
  </div>
);
