import { LucideLayers } from "lucide-react";

import { DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/utils/misc";

export const MobileSeriesButton = ({
  isVisible,
  seriesCount,
  className,
}: {
  isVisible: boolean;
  seriesCount: number;
  className?: string;
}) => (
  <DrawerTrigger asChild>
    <button
      className={cn(
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
        // Same baseline as the scroll-to-top button, opposite edge.
        "fixed bottom-20 left-4 z-40 size-12 transition-opacity duration-300 sm:bottom-4",
        className,
      )}
      aria-label="Open Series Navigation"
    >
      {/* Chamfer on an inner layer — clipping the button clips the count badge. */}
      <span className="clip-chamfer block size-full bg-green-500/25 p-px">
        <span className="clip-chamfer bg-surface-page flex size-full items-center justify-center">
          <LucideLayers size={18} className="stroke-green-400" />
        </span>
      </span>

      <span className="bg-surface-page absolute -top-1 -right-1 flex size-5 items-center justify-center border border-green-500/40 font-mono text-[10px] text-green-400 tabular-nums">
        {seriesCount}
      </span>
    </button>
  </DrawerTrigger>
);
