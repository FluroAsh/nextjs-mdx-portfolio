"use client";

import { cn } from "@/utils/misc";

type LightboxTriggerProps = {
  onOpen: () => void;
  /** Full accessible name, e.g. "Expand image: a red bridge". */
  label: string;
  className?: string;
  children: React.ReactNode;
};

/** Not a `<button>` — the tiles it wraps contain `div` and `figcaption`, which a button may not have as descendants. */
export const LightboxTrigger = ({
  onOpen,
  label,
  className,
  children,
}: LightboxTriggerProps) => (
  <div
    role="button"
    tabIndex={0}
    aria-label={label}
    onClick={onOpen}
    onKeyDown={(event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault(); // Space scrolls the page otherwise.
      onOpen();
    }}
    className={cn(
      "group hover:cursor-pointer",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400",
      className,
    )}
  >
    {children}
  </div>
);
