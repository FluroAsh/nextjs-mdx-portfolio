import Link from "next/link";

import { getSeriesPosts, isBlogSeries } from "@/data/content";
import { FIELD_LABELS } from "@/data/identity";
import { usePostContext } from "@/lib/contexts/post-context";
import { cn, toRomanNumeral, zeroPad } from "@/utils/misc";

import { PanelBlock, Readout } from "./block";

const NEXT_MARKER = { zh: "次篇", en: "UP NEXT" };
const PREV_MARKER = { zh: "前篇", en: "PREVIOUS" };

export const SeriesBlock = () => {
  const { post } = usePostContext();
  if (!isBlogSeries(post)) return null;

  const posts = getSeriesPosts(post);
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);

  return (
    <PanelBlock
      marker={FIELD_LABELS.series}
      trailing={
        <Readout>
          {zeroPad(currentIndex + 1)}/{zeroPad(posts.length)}
        </Readout>
      }
    >
      <p className="pb-2 font-mono text-[11px] text-neutral-400">
        {post.seriesTitle}
      </p>

      <ol>
        {posts.map((entry, index) => {
          const isCurrent = entry.slug === post.slug;

          return (
            <li key={entry.slug} className="flex items-baseline gap-2">
              {/* Fixed width — roman numerals vary, so the titles need a track. */}
              <span
                className={cn(
                  "w-6 shrink-0 text-right font-mono text-[10px]",
                  isCurrent ? "text-green-400" : "text-green-600/60",
                )}
              >
                {toRomanNumeral(index + 1)}
              </span>

              {isCurrent ? (
                <span className="block border-l-2 border-green-400 py-1 pl-2 font-mono text-[11px] text-green-300">
                  {entry.title}
                </span>
              ) : (
                <Link
                  href={entry.url}
                  className="block border-l-2 border-transparent py-1 pl-2 font-mono text-[11px] text-neutral-400 transition-colors duration-150 ease-linear hover:text-green-400"
                >
                  {entry.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </PanelBlock>
  );
};

export const NeighbourBlock = () => {
  const { prev, next } = usePostContext();
  const neighbour = prev ?? next;
  if (!neighbour) return null;

  return (
    <PanelBlock marker={prev ? PREV_MARKER : NEXT_MARKER}>
      <Link
        href={neighbour.url}
        className="block font-mono text-[11px] text-neutral-300 transition-colors duration-150 ease-linear hover:text-green-300"
      >
        {neighbour.title}
      </Link>
    </PanelBlock>
  );
};
