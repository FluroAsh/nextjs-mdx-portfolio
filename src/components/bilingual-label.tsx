import type { BilingualPair } from "@/data/identity";
import { cn } from "@/utils/misc";

/**
 * Two shades of one hue, never opacity — fading desaturates as well as darkens,
 * which dropped an earlier version to 2.9:1. Re-measure if this lands on a new
 * surface; it currently renders on three.
 *
 * Below `sm` the Chinese hides, not the English: dropping the half most people
 * can read would leave them with decoration.
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
    {/* Empty `zh` is valid — the gap must close, not leave a stray indent. */}
    {zh && (
      <span
        className={cn(
          "hidden sm:inline",
          tone === "signal" ? "text-signal" : "text-green-400",
        )}
      >
        {zh}
      </span>
    )}
    <span
      className={cn(
        zh && "sm:ml-1.5",
        tone === "signal" ? "text-signal-dim" : "text-green-600",
      )}
    >
      {en}
    </span>
  </span>
);
