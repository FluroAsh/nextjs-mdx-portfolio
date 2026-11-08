import { BilingualLabel } from "@/components/bilingual-label";
import { cn } from "@/utils/misc";

import { GALLERY_LABELS } from "../labels";
import type { GalleryCollection } from "../types";

type CollectionFilterProps = {
  collections: (GalleryCollection & {
    /** Photos in the collection. */
    count: number;
  })[];
  /** Photos across every collection. */
  total: number;
  /** Slug of the selected collection; `null` for all. */
  active: string | null;
  onChange: (collection: string | null) => void;
};

const Chip = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={isActive}
    onClick={onClick}
    className={cn(
      "shrink-0 border px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase",
      "transition-colors duration-150 ease-linear",
      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-400",
      isActive
        ? "border-green-400 bg-green-500/10 text-green-300"
        : "border-green-500/25 text-neutral-300 hover:border-green-400/60 hover:text-green-300",
    )}
  >
    {label}
    <span
      className={cn(
        "ml-2 tabular-nums",
        isActive ? "text-green-500" : "text-neutral-500",
      )}
    >
      {count}
    </span>
  </button>
);

export const CollectionFilter = ({
  collections,
  total,
  active,
  onChange,
}: CollectionFilterProps) => (
  <div
    role="group"
    aria-label="Filter by collection"
    className="flex items-center gap-4 border-b border-green-500/15 pb-4"
  >
    <BilingualLabel {...GALLERY_LABELS.collection} className="shrink-0" />

    {/* Scrolls sideways on a phone instead of wrapping into a second row of chips. */}
    <div className="scrollbar-slim -m-1 flex min-w-0 gap-2 overflow-x-auto p-1">
      <Chip
        label="All"
        count={total}
        isActive={active === null}
        onClick={() => onChange(null)}
      />
      {collections.map((collection) => (
        <Chip
          key={collection.slug}
          label={collection.title}
          count={collection.count}
          isActive={active === collection.slug}
          onClick={() => onChange(collection.slug)}
        />
      ))}
    </div>
  </div>
);
