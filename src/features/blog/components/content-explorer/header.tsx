import { BilingualLabel } from "@/components/bilingual-label";
import { type BilingualPair } from "@/data/identity";
import { zeroPad } from "@/utils/misc";

const MARKER: BilingualPair = { zh: "索引", en: "INDEX" };

export type ExplorerCounts = {
  /** Posts matching the current filter. Equals `totalPosts` on `/blog`. */
  resultCount: number;
  totalPosts: number;
};

/** Both halves must be countable on the page — no invented denominators. */
export const ExplorerHeader = ({
  resultCount,
  totalPosts,
  id,
}: ExplorerCounts & { id?: string }) => (
  <div className="flex items-baseline justify-between gap-3 border-b border-green-500/15 pb-2">
    <h2 id={id}>
      <BilingualLabel {...MARKER} />
    </h2>

    <span className="font-mono text-[10px] tracking-wider text-green-500/70 tabular-nums">
      {zeroPad(resultCount)}
      <span className="text-green-500/40">/</span>
      {zeroPad(totalPosts)}
    </span>
  </div>
);
