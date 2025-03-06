import { type ReadTimeResults } from "reading-time";

import { formatDate } from "@/utils/dates";
import { cn } from "@/utils/misc";

const ReadingTimeIndicator = ({ minutes }: { minutes: number }) => (
  <p className="text-sm text-neutral-400">
    • {minutes <= 1 ? "< 1 minute read" : `${Math.round(minutes)} minute read`}
  </p>
);

export const PublicationDate = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => (
  <time dateTime={date} className={cn("text-sm text-neutral-400", className)}>
    {formatDate(date)}&nbsp;
  </time>
);

export const ArticleDateTime = ({
  stats,
  date,
}: {
  stats: ReadTimeResults;
  date: string;
}) => {
  return (
    <div className="flex justify-center">
      <PublicationDate date={date} />
      <ReadingTimeIndicator minutes={stats.minutes} />
    </div>
  );
};
