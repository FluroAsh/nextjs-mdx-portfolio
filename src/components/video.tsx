"use client";

import { cn } from "@/utils/misc";
import React, { useState } from "react";

type PlayPauseIconProps = {
  isPlaying: boolean;
  show: boolean;
};

const PlayPauseIcon = ({ isPlaying, show }: PlayPauseIconProps) => {
  return (
    <div
      className={cn(
        show ? "opacity-100" : "opacity-0",
        "pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2",
        "items-center justify-center rounded-full bg-black/50 text-white transition-opacity duration-75",
      )}
    >
      {isPlaying ? (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
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
  className,
  type = "portrait",
  muted = true,
  ...props
}: VideoProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // TODO: Create intersection observer to lazy load video
  // Only set src when it's in view (trigger load)

  return (
    <div className="relative">
      <video
        className={cn(
          "relative mx-auto w-fit rounded-md hover:cursor-pointer",
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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
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
      <PlayPauseIcon isPlaying={!isPaused} show={isHovering} />
    </div>
  );
};
