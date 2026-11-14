"use client";

/**
 * PROTOTYPE, throwaway: four layouts for the collection filter on a phone, switched with
 * `?variant=A|B|C|D` and the floating bar (or ← / →). `?pad=N` adds N fake collections to stress the layout.
 */
import { useEffect, useState } from "react";

import { BilingualLabel } from "@/components/bilingual-label";
import { cn } from "@/utils/misc";

import { GALLERY_LABELS } from "../labels";
import type { ResolvedCollection } from "../types";

type Props = {
  collections: ResolvedCollection[];
  total: number;
  active: string | null;
  onChange: (collection: string | null) => void;
};

const VARIANTS = [
  ["A", "Current: scrolls sideways"],
  ["B", "Wrap onto rows"],
  ["C", "Select menu on phones"],
  ["D", "Collapsed, More expands"],
] as const;

type Key = (typeof VARIANTS)[number][0];

const chipClass = (isActive: boolean) =>
  cn(
    "shrink-0 border px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase",
    "transition-colors duration-150 ease-linear",
    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-400",
    isActive
      ? "border-green-400 bg-green-500/10 text-green-300"
      : "border-green-500/25 text-neutral-300 hover:border-green-400/60 hover:text-green-300",
  );

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
    className={chipClass(isActive)}
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

const Chips = ({
  items,
  active,
  onChange,
}: {
  items: { slug: string | null; title: string; count: number }[];
  active: string | null;
  onChange: (slug: string | null) => void;
}) =>
  items.map((item) => (
    <Chip
      key={item.slug ?? "all"}
      label={item.title}
      count={item.count}
      isActive={active === item.slug}
      onClick={() => onChange(item.slug)}
    />
  ));

const usePadded = (collections: ResolvedCollection[], total: number) => {
  const [pad, setPad] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prototype reads the URL once
    setPad(Number(new URLSearchParams(window.location.search).get("pad")) || 0);
  }, []);
  const fake = [
    "Kyoto Autumn",
    "Blue Mountains",
    "Night Markets",
    "Tasmania Coast",
    "Seoul Streets",
    "Hokkaido Snow",
    "Melbourne Laneways",
    "Taipei",
    "Osaka Neon",
    "Great Ocean Road",
  ];
  return [
    { slug: null, title: "All", count: total },
    ...collections.map((c) => ({ slug: c.slug, title: c.title, count: c.count })),
    ...Array.from({ length: pad }, (_, i) => ({
      slug: `fake-${i}`,
      title: fake[i % fake.length],
      count: 7 + ((i * 13) % 40),
    })),
  ];
};

const Frame = ({ children, stack }: { children: React.ReactNode; stack?: boolean }) => (
  <div
    role="group"
    aria-label="Filter by collection"
    className={cn(
      "flex gap-4 border-b border-green-500/15 pb-4",
      stack ? "flex-col gap-2 sm:flex-row sm:items-start sm:gap-4" : "items-center",
    )}
  >
    <BilingualLabel
      {...GALLERY_LABELS.collection}
      className={cn("shrink-0", stack && "sm:pt-2")}
    />
    {children}
  </div>
);

const VariantA = ({ items, active, onChange }: VariantProps) => (
  <Frame>
    <div className="scrollbar-slim -m-1 flex min-w-0 gap-2 overflow-x-auto p-1">
      <Chips items={items} active={active} onChange={onChange} />
    </div>
  </Frame>
);

const VariantB = ({ items, active, onChange }: VariantProps) => (
  <Frame stack>
    <div className="flex flex-wrap gap-2">
      <Chips items={items} active={active} onChange={onChange} />
    </div>
  </Frame>
);

const VariantC = ({ items, active, onChange }: VariantProps) => (
  <Frame>
    <label className="relative min-w-0 flex-1 sm:hidden">
      <span className="sr-only">Collection</span>
      <select
        value={active ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={cn(chipClass(true), "w-full appearance-none bg-transparent pr-8")}
      >
        {items.map((item) => (
          <option key={item.slug ?? "all"} value={item.slug ?? ""}>
            {item.title} · {item.count}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[11px] text-green-400"
      >
        ▾
      </span>
    </label>
    <div className="hidden flex-wrap gap-2 sm:flex">
      <Chips items={items} active={active} onChange={onChange} />
    </div>
  </Frame>
);

const COLLAPSED = 3;

const VariantD = ({ items, active, onChange }: VariantProps) => {
  const [open, setOpen] = useState(false);
  const activeItem = items.find((i) => i.slug === active);
  const head = items.slice(0, COLLAPSED);
  const shown =
    open || items.length <= COLLAPSED + 1
      ? items
      : activeItem && !head.includes(activeItem)
        ? [...head, activeItem]
        : head;
  const hidden = items.length - shown.length;

  return (
    <Frame stack>
      <div className="flex flex-wrap gap-2">
        <Chips items={shown} active={active} onChange={onChange} />
        {(hidden > 0 || open) && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="shrink-0 border border-dashed border-green-500/40 px-2.5 py-1.5 font-mono text-[11px] tracking-wider text-green-400 uppercase hover:border-green-400"
          >
            {open ? "Less −" : `+${hidden} more`}
          </button>
        )}
      </div>
    </Frame>
  );
};

type VariantProps = {
  items: ReturnType<typeof usePadded>;
  active: string | null;
  onChange: (slug: string | null) => void;
};

const COMPONENTS: Record<Key, (props: VariantProps) => React.ReactNode> = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
  D: VariantD,
};

const Switcher = ({ current, onChange }: { current: Key; onChange: (key: Key) => void }) => {
  const index = VARIANTS.findIndex(([key]) => key === current);
  const step = (delta: number) =>
    onChange(VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length][0]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-3 py-1.5 font-sans text-sm text-black shadow-lg">
      <button type="button" onClick={() => step(-1)} aria-label="Previous variant">
        ←
      </button>
      <span className="whitespace-nowrap">
        {current} ({VARIANTS[index][1]})
      </span>
      <button type="button" onClick={() => step(1)} aria-label="Next variant">
        →
      </button>
    </div>
  );
};

export const PrototypeCollectionFilter = ({ collections, total, active, onChange }: Props) => {
  const items = usePadded(collections, total);
  const [variant, setVariant] = useState<Key>("A");

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("variant");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prototype reads the URL once
    if (VARIANTS.some(([k]) => k === key)) setVariant(key as Key);
  }, []);

  const pick = (key: Key) => {
    setVariant(key);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", key);
    window.history.replaceState(window.history.state, "", url);
  };

  const Variant = COMPONENTS[variant];
  return (
    <>
      <Variant items={items} active={active} onChange={onChange} />
      {process.env.NODE_ENV !== "production" && <Switcher current={variant} onChange={pick} />}
    </>
  );
};
