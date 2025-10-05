import { LucideCalendar } from "lucide-react";
import { type ReadTimeResults } from "reading-time";

import { formatDate } from "@/utils/dates";
import { cn } from "@/utils/misc";

const ReadingTimeIndicator = ({ minutes }: { minutes: number }) => (
  <span className="ml-2 rounded-full bg-green-900/20 px-3 py-0.5 text-xs text-green-400/90">
    {minutes <= 1 ? "< 1 min read" : `${Math.round(minutes)} min read`}
  </span>
);

export const PublicationDate = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => (
  <span
    className={cn(
      "flex items-center rounded-full bg-neutral-800/70 px-3 py-0.5 text-xs text-nowrap text-neutral-300/90",
      className,
    )}
  >
    <LucideCalendar size={12} className="mr-1.5 text-neutral-400/90" />
    {formatDate(date)}
  </span>
);

export const ArticleDateTime = ({
  stats,
  date,
  className,
}: {
  stats: ReadTimeResults;
  date: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <PublicationDate date={date} />
      <ReadingTimeIndicator minutes={stats.minutes} />
    </div>
  );
};
