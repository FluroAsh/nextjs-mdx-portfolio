"use client";

import React, { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import { UseIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/utils/misc";

import { PlayPauseIcon } from "./play-pause-overlay";

type VideoProps = React.ComponentProps<"video"> & {
  type?: "landscape" | "portrait";
};

export const Video = ({
  src,
  type = "portrait",
  muted = true,
  className,
  ...props
}: VideoProps) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const { isIntersecting, ref: videoRef } =
    UseIntersectionObserver<HTMLVideoElement>();

  if (!src) {
    throw new Error("src is required");
  }

  useEffect(() => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;

    if (isIntersecting && !hasLoaded) {
      videoElement.src = src; // Lazy load video content
    }
  }, [videoRef, isIntersecting, src, hasLoaded]);

  useEffect(() => {
    if (!videoRef.current || !hasLoaded) return;
    const videoElement = videoRef.current;

    if (isIntersecting) {
      setIsPaused(false);
      videoElement.play();
    } else {
      setIsPaused(true);
      videoElement.pause();
    }
  }, [videoRef, isIntersecting, hasLoaded]);

  return (
    <div className="flex max-w-full justify-center">
      <div
        className={cn(
          "group relative my-4",
          // Make the container dimensions static: video fits the container for reduced CLS
          type === "landscape"
            ? "aspect-[16/9] w-[640px]"
            : "aspect-[9/16] max-h-[700px] w-[360px]",
        )}
      >
        {!hasLoaded && (
          <div className="absolute inset-0 grid animate-pulse place-items-center rounded-md bg-neutral-800/50">
            <Loader2 className="size-8 animate-spin stroke-neutral-600" />
          </div>
        )}

        <video
          ref={videoRef}
          className={cn(
            "size-full rounded-md opacity-0 transition-opacity duration-300 hover:cursor-pointer",
            hasLoaded && "opacity-100",
            className,
          )}
          muted={muted}
          autoPlay
          loop
          onLoadedData={() => setHasLoaded(true)}
          onClick={(e: React.MouseEvent<HTMLVideoElement>) => {
            e.preventDefault();
            const videoElement = e.currentTarget;

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
          <source src={undefined} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {hasLoaded && <PlayPauseIcon isPlaying={!isPaused} />}
      </div>
    </div>
  );
};
