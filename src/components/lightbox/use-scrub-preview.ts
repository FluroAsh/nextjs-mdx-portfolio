import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { type LightboxSlide, preload } from "./slide";

/** Milliseconds the photo takes to grow from the preview into the frame. */
const ENTRANCE_MS = 300;
/** Opacity of the photo on show while a preview covers it; the outgoing photo fades from here. */
export const DIMMED = 0.3;

/** A file the browser picked for a slide. */
type SlideFile = {
  /** The slide's `src`, which identifies it. */
  src: string;
  /** The file itself, which may be a narrower one from `srcSet`. */
  url: string;
};

/** The photo being left, drawn under the one arriving until its entrance ends. */
type Ghost = {
  /** The file it was showing. */
  url: string;
  /** Where it sat, in pixels from the stage's top left corner. */
  box: Record<"left" | "top" | "width" | "height", number>;
};

/**
 * The scrubber's preview and what happens when it ends: the photo on show changes once, growing out of the preview
 * into the frame over the top of the photo it replaces.
 */
export const useScrubPreview = (
  slides: LightboxSlide[],
  index: number | null,
  onIndexChange: (index: number) => void,
) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  /** Shown in the frame until the full file arrives, so the entrance does not drop back to the blur. */
  const [carried, setCarried] = useState<SlideFile>();

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  /** The preview reuses one image element, so what it has loaded is tracked by slide, not read off the element. */
  const previewFile = useRef<SlideFile | null>(null);
  /** Where the preview sat when the scrub ended; the photo enters the frame from there. Photo-shaped only when the slide's size is known, which `commit` requires. */
  const entrance = useRef<DOMRect | null>(null);

  /** Closing mid-scrub unmounts the scrubber before it can end the preview. */
  if (index === null && (previewIndex !== null || ghost)) {
    setPreviewIndex(null);
    setGhost(null);
  }

  /** The scrubber's moves come through here. It runs while the preview is still on the page, which is the only time the preview can be measured. */
  const commit = (next: number) => {
    const image = previewImageRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    const target = slides[next];
    const isAnimated =
      image &&
      frame &&
      stage &&
      target.width &&
      target.height &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isAnimated) {
      entrance.current = image.getBoundingClientRect();
      if (previewFile.current?.src === target.src)
        setCarried(previewFile.current);

      const outgoing = frame.querySelector("img")?.currentSrc;
      const box = frame.getBoundingClientRect();
      const origin = stage.getBoundingClientRect();
      if (outgoing)
        setGhost({
          url: outgoing,
          box: {
            left: box.left - origin.left,
            top: box.top - origin.top,
            width: box.width,
            height: box.height,
          },
        });
    }
    onIndexChange(next);
  };

  useLayoutEffect(() => {
    if (previewIndex !== null) return;
    const from = entrance.current;
    entrance.current = null;
    const frame = frameRef.current;
    if (!from || !frame) return;

    const to = frame.getBoundingClientRect();
    const start = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    /** The same picture at the same shape, so one transform covers the move. */
    frame.animate(
      [
        { transformOrigin: "top left", transform: start },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: ENTRANCE_MS, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
    /** Held back until the photo is nearly in place; it would otherwise sit alone under a small photo. */
    captionRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: ENTRANCE_MS / 2,
      delay: ENTRANCE_MS / 2,
      fill: "backwards",
    });
    ghostRef.current
      ?.animate([{ opacity: DIMMED }, { opacity: 0 }], {
        duration: ENTRANCE_MS,
        easing: "ease-in",
        fill: "forwards",
      })
      .finished.then(
        () => setGhost(null),
        () => {},
      );
  }, [previewIndex]);

  /** A pause on a photo is the best guess at where the scrub will end, so its full file gets a head start. */
  useEffect(() => {
    if (previewIndex === null) return;
    const timeout = setTimeout(() => preload(slides[previewIndex]), 150);
    return () => clearTimeout(timeout);
  }, [previewIndex, slides]);

  return {
    previewIndex,
    setPreviewIndex,
    commit,
    ghost,
    /** The preview's file for a slide, if the scrub ended on it with that file loaded. */
    carriedUrl: (slide: LightboxSlide) =>
      carried?.src === slide.src ? carried.url : undefined,
    onPreviewFileLoad: (src: string, url: string) => {
      previewFile.current = { src, url };
    },
    stageRef,
    frameRef,
    captionRef,
    ghostRef,
    previewImageRef,
  };
};
