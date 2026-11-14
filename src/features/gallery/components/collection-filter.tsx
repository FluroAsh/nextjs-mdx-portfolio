import { useState } from "react";

import { BilingualLabel } from "@/components/bilingual-label";
import { cn } from "@/utils/misc";

import { GALLERY_LABELS } from "../labels";
import type { ResolvedCollection } from "../types";

type CollectionFilterProps = {
  collections: ResolvedCollection[];
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
  collapsed,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  /** Hidden on phones while the list is collapsed. */
  collapsed: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={isActive}
    onClick={onClick}
    className={cn(
      collapsed && "max-sm:hidden",
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

/** Collections shown on a phone before "more" is tapped; the active one always stays visible. */
const PHONE_VISIBLE = 2;

export const CollectionFilter = ({
  collections,
  total,
  active,
  onChange,
}: CollectionFilterProps) => {
  const [expanded, setExpanded] = useState(false);
  const isHidden = (slug: string, index: number) =>
    !expanded && index >= PHONE_VISIBLE && slug !== active;
  const hiddenCount = collections.filter((c, i) => isHidden(c.slug, i)).length;

  return (
    <div
      role="group"
      aria-label="Filter by collection"
      className="flex flex-col gap-2 border-b border-green-500/15 pb-4 sm:flex-row sm:items-start sm:gap-4"
    >
      <BilingualLabel
        {...GALLERY_LABELS.collection}
        className="shrink-0 sm:pt-2"
      />

      <div className="flex flex-wrap gap-2">
        <Chip
          label="All"
          count={total}
          isActive={active === null}
          collapsed={false}
          onClick={() => onChange(null)}
        />
        {collections.map((collection, index) => (
          <Chip
            key={collection.slug}
            label={collection.title}
            count={collection.count}
            isActive={active === collection.slug}
            collapsed={isHidden(collection.slug, index)}
            onClick={() => onChange(collection.slug)}
          />
        ))}
        {(expanded || hiddenCount > 0) && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "shrink-0 border border-dashed border-green-500/40 px-2.5 py-1.5 font-mono text-[11px] tracking-wider text-green-400 uppercase sm:hidden",
              "transition-colors duration-150 ease-linear hover:border-green-400",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-400",
            )}
          >
            {expanded ? "Less" : `+${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
};
