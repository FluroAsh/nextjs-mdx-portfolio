"use client";

import React, { useState } from "react";
import { LucidePause, LucidePlay } from "lucide-react";

import { cn } from "@/utils/misc";

const PlayPauseIcon = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2",
          "items-center justify-center rounded-full bg-black/50 transition-opacity duration-75",
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

type VideoProps = React.ComponentProps<"video"> & {
  type?: "landscape" | "portrait";
};

export const Video = ({
  src,
  width = 640,
  height = 360,
  type = "portrait",
  muted = true,
  className,
  ...props
}: VideoProps) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // TODO: Create intersection observer to lazy load video
  // Only set src when it's in view (trigger load)

  return (
    <div className="flex justify-center">
      <div className="group relative my-4">
        <video
          className={cn(
            "w-fit rounded-md hover:cursor-pointer",
            type === "landscape"
              ? "aspect-[16/9]"
              : "aspect-[9/16] max-h-[700px]",
            className,
          )}
          width={width}
          height={height}
          muted={muted}
          autoPlay
          loop
          onClick={(e) => {
            e.preventDefault();
            const videoElement = e.currentTarget as HTMLVideoElement;

            if (videoElement.paused) {
              setIsPaused(false);
              videoElement.play();
            } else {
              setIsPaused(true);
              videoElement.pause();
            }
          }}
          {...props}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <PlayPauseIcon isPlaying={!isPaused} />
      </div>
    </div>
  );
};
