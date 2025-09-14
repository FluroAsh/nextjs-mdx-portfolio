import Link from "next/link";

import { cn } from "@/utils/misc";

interface SeriesItemProps {
  title: string;
  url: string;
  index: number;
  isCurrent: boolean;
  onClick?: () => void;
}

export const SeriesItem = ({
  title,
  url,
  index,
  isCurrent,
  onClick,
}: SeriesItemProps) => {
  const content = (
    <div className="contents [&>span]:transition-colors [&>span]:duration-75">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center self-start rounded-full text-xs font-bold",
          isCurrent
            ? "bg-green-500 text-black"
            : "bg-neutral-700 text-neutral-400 group-hover:text-neutral-200",
        )}
      >
        {index + 1}
      </span>

      <span
        className={cn(
          "line-clamp-2 text-sm leading-tight font-semibold",
          isCurrent
            ? "text-green-400"
            : "text-neutral-400 group-hover:text-neutral-200",
        )}
      >
        {title}
      </span>
    </div>
  );

  if (isCurrent) {
    return (
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-75",
          "border border-green-500/30 bg-green-900/20",
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={url}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-75",
        "hover:bg-neutral-800/30",
      )}
    >
      {content}
    </Link>
  );
};
