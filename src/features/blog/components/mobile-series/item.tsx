import Link from "next/link";

import { cn } from "@/utils/misc";

type MobileSeriesItemProps = {
  title: string;
  url: string;
  index: number;
  isCurrent: boolean;
  onItemClick: () => void;
};

export const MobileSeriesItem = ({
  title,
  url,
  index,
  isCurrent,
  onItemClick,
}: MobileSeriesItemProps) => {
  const content = (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          isCurrent
            ? "bg-green-500 text-black"
            : "bg-neutral-700 text-neutral-300",
        )}
      >
        {index + 1}
      </span>
      <span
        className={cn(
          "line-clamp-2 text-base leading-tight font-semibold",
          isCurrent ? "text-green-400" : "text-neutral-300",
        )}
      >
        {title}
      </span>
    </div>
  );

  if (isCurrent) {
    return (
      <div className="rounded-md border border-green-500/30 bg-green-900/20 px-3 py-3">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={url}
      onClick={onItemClick}
      className="block rounded-md px-3 py-3 transition-colors duration-75 hover:bg-neutral-800/30"
    >
      {content}
    </Link>
  );
};
