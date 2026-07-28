import type { BilingualPair } from "@/data/identity";
import { cn } from "@/utils/misc";

/**
 * Both halves are one label: same colour, with the difference coming from two
 * shades rather than opacity — fading washes the colour out as well as
 * darkening it, which is what made an earlier `/50` read as a muddy grey-green
 * at 2.9:1. Both shades clear the 4.5 floor; re-measure against the surface if
 * this lands on a new one, since it now renders on three.
 *
 * Below `sm` the Chinese is hidden, not the English. Dropping the half most
 * people can actually read would leave them with decoration.
 */
export const BilingualLabel = ({
  zh,
  en,
  tone = "default",
  className,
}: BilingualPair & {
  /** `signal` marks the one recurring status — the currently-held role. */
  tone?: "default" | "signal";
  className?: string;
}) => (
  <span
    className={cn("font-mono text-[10px] tracking-wider uppercase", className)}
  >
    <span
      className={cn(
        "hidden sm:inline",
        tone === "signal" ? "text-signal" : "text-green-400",
      )}
    >
      {zh}
    </span>
    <span
      className={cn(
        "sm:ml-1.5",
        tone === "signal" ? "text-signal-dim" : "text-green-600",
      )}
    >
      {en}
    </span>
  </span>
);
