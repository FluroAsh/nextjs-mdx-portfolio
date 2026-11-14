import { forwardRef } from "react";

import { cn } from "@/utils/misc";

type IconButtonProps = React.ComponentProps<"button"> & {
  /** Accessible name; the icon alone has none. */
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 shrink-0 place-items-center border border-green-500/25 bg-black/40 text-neutral-300",
        "transition-colors duration-150 ease-linear hover:border-green-400 hover:text-green-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400",
        "disabled:pointer-events-none disabled:opacity-30",
        "[&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";
