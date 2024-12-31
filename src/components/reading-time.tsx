import { format, parseISO } from "date-fns";
import { type ReadTimeResults } from "reading-time";

const ReadingTimeIndicator = ({ minutes }: { minutes: number }) => (
  <p className="text-sm text-neutral-400">
    • {minutes <= 1 ? "< 1 minute read" : `${Math.round(minutes)} minute read`}
  </p>
);

const PublicationDate = ({ date }: { date: string }) => (
  <time dateTime={date} className="text-sm text-neutral-400 ">
    {format(parseISO(date), "LLLL d, yyyy")}&nbsp;
  </time>
);

export default function ArticleDateTime({
  stats,
  date,
}: {
  stats: ReadTimeResults;
  date: string;
}) {
  return (
    <div className="flex justify-center">
      <PublicationDate date={date} />
      <ReadingTimeIndicator minutes={stats.minutes} />
    </div>
  );
}
