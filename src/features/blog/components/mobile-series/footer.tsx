import Link from "next/link";

import { LucideChevronLeft } from "lucide-react";

import { BilingualLabel } from "@/components/bilingual-label";
import { paths } from "@/config/paths";

export const MobileSeriesFooter = ({
  onFooterClick,
}: {
  onFooterClick: () => void;
}) => (
  <div className="border-t border-green-500/15 pt-4">
    <Link
      href={paths.blog}
      onClick={onFooterClick}
      className="inline-flex items-center gap-1.5"
    >
      <LucideChevronLeft className="size-3.5 text-green-600" />
      <BilingualLabel zh="返回" en="INDEX" />
    </Link>
  </div>
);
