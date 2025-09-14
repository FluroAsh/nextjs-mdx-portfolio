import { LucideBook } from "lucide-react";

import { cn, toRomanNumeral } from "@/utils/misc";

type SeriesBadgeProps = {
  seriesTitle: string;
  seriesOrder?: number;
  className?: string;
};

export const SeriesBadge = ({
  seriesTitle,
  seriesOrder,
  className,
}: SeriesBadgeProps) => (
  <div
    className={cn(
      "inline-flex items-center justify-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-400",
      className,
    )}
  >
    <LucideBook className="size-3" />
    <span className="truncate">{seriesTitle}</span>

    {seriesOrder && (
      <span className="ml-1 text-[10px] leading-none font-medium text-blue-300/90">
        {toRomanNumeral(seriesOrder)}
      </span>
    )}
  </div>
);
