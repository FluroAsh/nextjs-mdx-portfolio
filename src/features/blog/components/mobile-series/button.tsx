import { LucideBook } from "lucide-react";
import { useMedia } from "react-use";

import { DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/utils/misc";

interface MobileSeriesButtonProps {
  isVisible: boolean;
  seriesCount: number;
  className?: string;
}

export const MobileSeriesButton = ({
  isVisible,
  seriesCount,
  className,
}: MobileSeriesButtonProps) => {
  const isTablet = useMedia(
    "(min-width: 768px) and (max-width: 1024px)",
    false,
  );

  return (
    <DrawerTrigger asChild>
      <button
        className={cn(
          isVisible
            ? "opacity-100"
            : "pointer-events-none opacity-0",
          "fixed z-10 mr-2 size-12 transition-opacity duration-300",
          isTablet ? "bottom-3 left-4" : "bottom-19 left-4",
          className,
        )}
        aria-label="Open Series Navigation"
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full border-2 border-neutral-700 bg-gradient-to-b from-neutral-800 to-neutral-900">
          <LucideBook size={20} className="stroke-neutral-400" />
        </div>

        <div className="absolute -top-1 -right-1 z-20 flex size-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
          {seriesCount}
        </div>
      </button>
    </DrawerTrigger>
  );
};