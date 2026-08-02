import { BilingualLabel } from "@/components/bilingual-label";
import { type BilingualPair } from "@/data/identity";

export const DRAWER_SHELL =
  "bg-surface-page rounded-none border-t border-green-500/25 [&>div:first-child]:bg-green-500/30";

export const DrawerMarker = ({
  zh,
  en,
  readout,
}: BilingualPair & { readout?: string }) => (
  <div className="flex items-baseline justify-between border-b border-green-500/15 px-4 pt-5 pb-3">
    <BilingualLabel zh={zh} en={en} />

    {readout && (
      <span className="font-mono text-[10px] tracking-wider text-green-600 tabular-nums">
        {readout}
      </span>
    )}
  </div>
);
