import { LucidePause, LucidePlay } from "lucide-react";

import { cn } from "@/utils/misc";

export const PlayPauseIcon = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2",
          "items-center justify-center rounded-full bg-black/50 transition-opacity",
        )}
      >
        {isPlaying ? (
          <LucidePause className="fill-neutral-100 stroke-neutral-100" />
        ) : (
          <LucidePlay className="fill-neutral-100 stroke-neutral-100" />
        )}
      </div>
    </div>
  );
};
