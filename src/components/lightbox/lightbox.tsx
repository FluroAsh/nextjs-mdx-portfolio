"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn, zeroPad } from "@/utils/misc";

import { IconButton } from "./icon-button";
import { Scrubber } from "./scrubber";

/** Horizontal travel in pixels before a touch counts as a swipe. */
const SWIPE_DISTANCE = 50;

/** The photo is bounded by height, so this over-asks on wide screens rather than under-asks on tall ones. */
const SIZES = "100vw";

export type LightboxSlide = {
  /** Largest file; also what identifies the slide, so it must be unique in the list. */
  src: string;
  /** Narrower files the browser may pick in place of `src`. */
  srcSet?: string;
  /** Alternative text for the image. */
  alt: string;
  /** Intrinsic width of `src` in pixels; reserves the frame before the file loads. */
  width?: number;
  /** Intrinsic height of `src` in pixels. */
  height?: number;
  /** Base64 blur shown until the file loads. */
  placeholder?: string;
};

type LightboxProps = {
  /** The whole set being browsed, in order; the arrows stop at both ends. */
  slides: LightboxSlide[];
  /** Index into `slides`; `null` when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Header text at desktop widths, e.g. the collection the photo is from. */
  meta?: React.ReactNode;
  /** Line under the photo. */
  caption?: React.ReactNode;
  /** Header buttons shown before close. */
  actions?: React.ReactNode;
  /** Panel beside the photo, below it on a phone. It names the dialog, so it must render `Dialog.Title`, and it carries the close button at desktop widths. */
  aside?: React.ReactNode;
  /** Adds a short rail of ticks, one per slide, to jump or drag through the set; shown from tablet widths. */
  scrubber?: boolean;
  /** Runs before focus returns to whatever opened the dialog; prevent it to place focus elsewhere. */
  onCloseAutoFocus?: (event: Event) => void;
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="border border-green-500/30 px-1.5 py-0.5 text-neutral-300">
    {children}
  </kbd>
);

const preload = ({ src, srcSet }: LightboxSlide) => {
  const image = new Image();
  if (srcSet) {
    image.sizes = SIZES;
    image.srcset = srcSet;
  }
  image.src = src;
};

/** The one photo viewer: a fixed set of slides, with slots for what differs between the gallery and a post. */
export const Lightbox = ({
  slides,
  index,
  onIndexChange,
  onClose,
  meta,
  caption,
  actions,
  aside,
  scrubber,
  onCloseAutoFocus,
}: LightboxProps) => {
  const slide = index === null ? undefined : slides[index];
  const touchStartX = useRef<number | null>(null);
  const opener = useRef<Element | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  /** Size of the frame while scrubbing, kept so it can ease back to the photo afterwards. */
  const steadySize = useRef<DOMRect | null>(null);

  const isSeries = slides.length > 1;
  const hasScrubber = scrubber && isSeries;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < slides.length - 1;
  const goPrev = () => hasPrev && onIndexChange(index - 1);
  const goNext = () => hasNext && onIndexChange(index + 1);

  /** Neighbours load once this one has settled, so stepping is instant but a drag along the scrubber does not fetch every photo it passes. */
  useEffect(() => {
    if (index === null) return;
    const timeout = setTimeout(() => {
      for (const neighbour of [slides[index - 1], slides[index + 1]]) {
        if (neighbour) preload(neighbour);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [index, slides]);

  const isLoaded = loadedSrc === slide?.src;
  /** Caps the scrubbing frame at the photo's long edge, so a large screen does not show a frame far bigger than any photo in it. */
  const longEdge =
    slide?.width && slide.height
      ? Math.max(slide.width, slide.height)
      : undefined;

  /** The frame cannot transition between a fixed box and a fitted one in CSS, so it is animated from the size it had. */
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (isScrubbing) {
      steadySize.current = frame.getBoundingClientRect();
      return;
    }

    const from = steadySize.current;
    steadySize.current = null;
    if (!from || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = frame.getBoundingClientRect();
    frame.animate(
      [
        { width: `${from.width}px`, height: `${from.height}px` },
        { width: `${to.width}px`, height: `${to.height}px` },
      ],
      { duration: 200, easing: "ease-out" },
    );
  }, [isScrubbing]);

  return (
    <Dialog.Root open={!!slide} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm" />
        {slide && (
          <Dialog.Content
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") goPrev();
              if (event.key === "ArrowRight") goNext();
            }}
            /** Focus would land on the first button otherwise, and arrow keys need the dialog focused. */
            onOpenAutoFocus={(event) => {
              opener.current = document.activeElement;
              event.preventDefault();
              (event.currentTarget as HTMLElement).focus();
            }}
            /** Radix only returns focus to its own `Dialog.Trigger`, and the tiles that open this are not one. */
            onCloseAutoFocus={(event) => {
              onCloseAutoFocus?.(event);
              if (event.defaultPrevented) return;
              if (opener.current instanceof HTMLElement) opener.current.focus();
            }}
            className={cn(
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[60] outline-none",
              "flex flex-col overflow-y-auto overscroll-contain",
              aside &&
                "lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden",
            )}
          >
            {!aside && (
              <>
                <Dialog.Title className="sr-only">{slide.alt}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  {isSeries
                    ? `Image ${index! + 1} of ${slides.length}`
                    : "Enlarged image"}
                </Dialog.Description>
              </>
            )}

            <section
              aria-label="Photo"
              className={cn(
                "relative flex shrink-0 flex-col",
                aside ? "lg:h-dvh" : "h-dvh",
              )}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance =
                  event.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (distance > SWIPE_DISTANCE) goPrev();
                if (distance < -SWIPE_DISTANCE) goNext();
              }}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 font-mono text-[11px] tracking-wider uppercase sm:px-6 lg:py-5">
                <span
                  className="text-neutral-400 tabular-nums"
                  aria-live="polite"
                >
                  {isSeries && (
                    <>
                      <span className="text-green-400">
                        {zeroPad(index! + 1)}
                      </span>
                      <span className="mx-1.5 text-green-700">/</span>
                      {zeroPad(slides.length)}
                    </>
                  )}
                </span>
                {meta && (
                  <span className="hidden truncate text-neutral-400 lg:block">
                    {meta}
                  </span>
                )}
                {isSeries && (
                  <span aria-hidden className="text-neutral-500 lg:hidden">
                    Swipe ← →
                  </span>
                )}
                <div
                  className={cn(
                    "flex items-center gap-2",
                    aside && "lg:hidden",
                  )}
                >
                  {actions}
                  <Dialog.Close asChild>
                    <IconButton label="Close">
                      <X />
                    </IconButton>
                  </Dialog.Close>
                </div>
              </div>

              <div
                className={cn(
                  "relative flex min-h-0 flex-1 items-center justify-center px-4 pb-2 lg:pb-0",
                  hasScrubber ? "sm:px-28" : "sm:px-20",
                )}
                /** Only the empty space around the photo closes; a click on the photo or a button must not. */
                onClick={(event) =>
                  event.target === event.currentTarget && onClose()
                }
              >
                <figure
                  className={cn(
                    "flex max-h-full max-w-full flex-col",
                    isScrubbing && "w-full",
                  )}
                >
                  <div
                    ref={frameRef}
                    /**
                     * Sized by the photo, so the ticks sit on its corners. While scrubbing it holds the largest
                     * box a photo can take, so landscape and portrait photos pass without the frame or caption moving.
                     */
                    className={cn(
                      "plate-ticks relative mx-auto flex max-w-full items-center justify-center outline outline-green-500/25",
                      !isScrubbing
                        ? "w-fit"
                        : aside
                          ? "h-[62dvh] w-full lg:h-[calc(100dvh-180px)]"
                          : "h-[calc(100dvh-180px)] w-full",
                    )}
                    style={
                      isScrubbing
                        ? { maxWidth: longEdge, maxHeight: longEdge }
                        : undefined
                    }
                  >
                    <div
                      className="min-h-0 min-w-0 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          !isLoaded && slide.placeholder
                            ? `url(${slide.placeholder})`
                            : undefined,
                      }}
                    >
                      {/* No `key`: changing `src` on the same element is what cancels a load the scrubber has moved past. */}
                      <img
                        src={slide.src}
                        srcSet={slide.srcSet}
                        sizes={slide.srcSet && SIZES}
                        alt={slide.alt}
                        width={slide.width}
                        height={slide.height}
                        onLoad={() => setLoadedSrc(slide.src)}
                        draggable={false}
                        className={cn(
                          "block h-auto w-auto max-w-full object-contain",
                          aside
                            ? "max-h-[62dvh] lg:max-h-[calc(100dvh-180px)]"
                            : "max-h-[calc(100dvh-180px)]",
                          "transition-opacity duration-200",
                          isLoaded ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </div>
                  </div>
                  {caption && (
                    <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums">
                      {caption}
                    </figcaption>
                  )}
                </figure>

                {hasScrubber && (
                  <Scrubber
                    count={slides.length}
                    index={index!}
                    onIndexChange={onIndexChange}
                    onScrubbingChange={setIsScrubbing}
                    className="absolute top-1/2 left-0 hidden -translate-y-1/2 sm:block"
                  />
                )}

                {isSeries && (
                  <>
                    <IconButton
                      label="Previous photo"
                      onClick={goPrev}
                      disabled={!hasPrev}
                      className={cn(
                        "absolute top-1/2 hidden -translate-y-1/2 sm:grid lg:size-12",
                        hasScrubber ? "left-10 lg:left-12" : "left-2 lg:left-6",
                      )}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      label="Next photo"
                      onClick={goNext}
                      disabled={!hasNext}
                      className={cn(
                        "absolute top-1/2 hidden -translate-y-1/2 sm:grid lg:size-12",
                        hasScrubber
                          ? "right-10 lg:right-12"
                          : "right-2 lg:right-6",
                      )}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
              </div>

              <p
                aria-hidden
                className="hidden items-center justify-center gap-2 py-5 font-mono text-[10px] tracking-wider text-neutral-500 uppercase lg:flex"
              >
                {isSeries && (
                  <>
                    <Kbd>←</Kbd>
                    <Kbd>→</Kbd>
                    <span className="mr-2">Nav</span>
                  </>
                )}
                <Kbd>Esc</Kbd>
                <span>Close</span>
              </p>
            </section>

            {aside}
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};
