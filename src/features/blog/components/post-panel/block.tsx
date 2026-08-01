import { BilingualLabel } from "@/components/bilingual-label";
import { type BilingualPair } from "@/data/identity";
import { cn } from "@/utils/misc";

export const Readout = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] tracking-wider text-green-600 tabular-nums">
    {children}
  </span>
);

export const PanelBlock = ({
  marker,
  trailing,
  className,
  /** The contents list pads inside its own scroller; wrapping it here would break the flex chain it needs in order to shrink. */
  flush = false,
  children,
}: {
  marker: BilingualPair;
  trailing?: React.ReactNode;
  className?: string;
  flush?: boolean;
  children: React.ReactNode;
}) => (
  <div className={cn("flex flex-col border-t border-green-500/15", className)}>
    <div className="flex shrink-0 items-baseline justify-between px-4 pt-4 pb-2">
      <BilingualLabel {...marker} />
      {trailing}
    </div>

    {flush ? children : <div className="px-4 pb-4">{children}</div>}
  </div>
);
