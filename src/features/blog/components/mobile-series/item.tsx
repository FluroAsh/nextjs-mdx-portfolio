import Link from "next/link";

import { cn, toRomanNumeral } from "@/utils/misc";

export const MobileSeriesItem = ({
  title,
  url,
  index,
  isCurrent,
  onItemClick,
}: {
  title: string;
  url: string;
  index: number;
  isCurrent: boolean;
  onItemClick: () => void;
}) => {
  const content = (
    <>
      {/* Fixed width — roman numerals vary, so the titles need a track. */}
      <span
        className={cn(
          "w-7 shrink-0 text-right font-mono text-[11px]",
          isCurrent ? "text-green-400" : "text-green-600/60",
        )}
      >
        {toRomanNumeral(index + 1)}
      </span>

      <span
        className={cn(
          "border-l-2 py-1 pl-3 font-mono text-[13px] leading-snug",
          isCurrent
            ? "border-green-400 text-green-300"
            : "border-transparent text-neutral-300",
        )}
      >
        {title}
      </span>
    </>
  );

  if (isCurrent) {
    return <div className="flex items-baseline gap-2">{content}</div>;
  }

  return (
    <Link
      href={url}
      onClick={onItemClick}
      className="flex items-baseline gap-2 active:[&>span:last-child]:text-green-300"
    >
      {content}
    </Link>
  );
};
