import Link from "next/link";

import { LucideChevronLeft } from "lucide-react";

import { paths } from "@/config/paths";

export const MobileSeriesFooter = ({
  onFooterClick,
}: {
  onFooterClick: () => void;
}) => (
  <div className="border-t border-neutral-700/50 pt-4">
    <Link
      href={paths.blog}
      onClick={onFooterClick}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-neutral-400 transition-colors duration-75 hover:text-green-500"
    >
      <LucideChevronLeft className="size-4" />
      <span>All Posts</span>
    </Link>
  </div>
);
