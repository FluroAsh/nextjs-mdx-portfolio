"use client";

import { useEffect, useRef, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn, zeroPad } from "@/utils/misc";

import { IconButton } from "./icon-button";
import { ScrubPreview } from "./scrub-preview";
import { Scrubber } from "./scrubber";
import { type LightboxSlide, SIZES, preload } from "./slide";
import { useBackToClose } from "./use-back-to-close";
import { DIMMED, useScrubPreview } from "./use-scrub-preview";
import { useTouchGestures } from "./use-touch-gestures";

export type { LightboxSlide };

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
  /** Adds a short rail of ticks, one per slide, to jump or drag through the set; shown where there is room beside the photo. */
  scrubber?: boolean;
  /** Runs before focus returns to whatever opened the dialog; prevent it to place focus elsewhere. */
  onCloseAutoFocus?: (event: Event) => void;
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="border border-green-500/30 px-1.5 py-0.5 text-neutral-300">
    {children}
  </kbd>
);

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
  const opener = useRef<Element | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  /** Destructured, not kept as one object: the refs lint reads a member of an object holding refs as a ref read. */
  const {
    previewIndex,
    setPreviewIndex,
    commit,
    ghost,
    carriedUrl,
    onPreviewFileLoad,
    stageRef,
    frameRef,
    captionRef,
    ghostRef,
    previewImageRef,
  } = useScrubPreview(slides, index, onIndexChange);

  const isSeries = slides.length > 1;
  const hasScrubber = scrubber && isSeries;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < slides.length - 1;
  const goPrev = () => hasPrev && onIndexChange(index - 1);
  const goNext = () => hasNext && onIndexChange(index + 1);

  useBackToClose(!!slide, onClose);
  const gestureArea = useTouchGestures({
    onPrevious: goPrev,
    onNext: goNext,
    onDismiss: onClose,
    overlayRef,
  });

  /** Neighbours load once this one has settled, so stepping is instant but a held arrow key does not fetch every photo it passes. */
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
  const backdropUrl = slide && (carriedUrl(slide) ?? slide.placeholder);
  const ratio =
    slide?.width && slide.height ? slide.width / slide.height : undefined;
  /** The photo and its caption dim under a scrub preview. They fade down but return at once: the photo's entrance is the transition out. */
  const dimmed = previewIndex !== null ? DIMMED : undefined;
  const dimming =
    previewIndex !== null &&
    "transition-opacity duration-150 ease-linear motion-reduce:transition-none";

  return (
    <Dialog.Root open={!!slide} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm"
        />
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
              ref={gestureArea}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 font-mono text-[11px] tracking-wider uppercase sm:px-6 lg:py-5">
                {/* On a phone the counter carries the previous and next buttons, which have no room beside the photo; swipe alone would leave no way through for anyone who cannot swipe. */}
                <div className="flex items-center gap-3">
                  {isSeries && (
                    <IconButton
                      label="Previous photo"
                      onClick={goPrev}
                      disabled={!hasPrev}
                      className="sm:hidden"
                    >
                      <ChevronLeft />
                    </IconButton>
                  )}
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
                  {isSeries && (
                    <IconButton
                      label="Next photo"
                      onClick={goNext}
                      disabled={!hasNext}
                      className="sm:hidden"
                    >
                      <ChevronRight />
                    </IconButton>
                  )}
                </div>
                {meta && (
                  <span className="hidden truncate text-neutral-400 lg:block">
                    {meta}
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
                ref={stageRef}
                className={cn(
                  /** A container, so the photo can size itself from the room it has before its file loads. */
                  "@container relative flex min-h-0 flex-1 items-center justify-center px-4 pb-2 lg:pb-0",
                  hasScrubber ? "sm:px-28" : "sm:px-20",
                )}
                /** Only the empty space around the photo closes; a click on the photo or a button must not. */
                onClick={(event) =>
                  event.target === event.currentTarget && onClose()
                }
              >
                {ghost && (
                  <img
                    ref={ghostRef}
                    src={ghost.url}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute"
                    style={{ ...ghost.box, opacity: DIMMED }}
                  />
                )}

                {/* Positioned so it paints over the outgoing photo. */}
                <figure className="relative flex max-h-full max-w-full flex-col">
                  {/* The photo's own box, so the scrub preview can centre on the photo and stay within it. */}
                  <div className="relative mx-auto w-fit max-w-full">
                    <div
                      ref={frameRef}
                      /** Sized by the image, so the ticks sit on its corners. */
                      className={cn(
                        "plate-ticks relative bg-cover bg-center",
                        dimming,
                      )}
                      style={{
                        opacity: dimmed,
                        backgroundImage:
                          !isLoaded && backdropUrl
                            ? `url(${backdropUrl})`
                            : undefined,
                      }}
                    >
                      {/* Remounted per slide: a reused element keeps the last photo's size until the next one loads. */}
                      <img
                        key={slide.src}
                        src={slide.src}
                        srcSet={slide.srcSet}
                        sizes={slide.srcSet && SIZES}
                        alt={slide.alt}
                        width={slide.width}
                        height={slide.height}
                        onLoad={() => setLoadedSrc(slide.src)}
                        draggable={false}
                        className={cn(
                          "block h-auto max-h-(--photo-max-h) max-w-full border border-green-500/25 object-contain",
                          aside
                            ? "[--photo-max-h:62dvh] lg:[--photo-max-h:calc(100dvh-180px)]"
                            : "[--photo-max-h:calc(100dvh-180px)]",
                          !ratio && "w-auto",
                          "transition-opacity duration-200",
                          isLoaded ? "opacity-100" : "opacity-0",
                        )}
                        /** An explicit width: with both sides `auto` an image has no size until its file's header arrives, whatever its `width` and `height` say. */
                        style={
                          ratio
                            ? {
                                width: `min(100cqw, calc(var(--photo-max-h) * ${ratio}), ${slide.width}px)`,
                              }
                            : undefined
                        }
                      />
                    </div>

                    {previewIndex !== null && slides[previewIndex] && (
                      <ScrubPreview
                        slide={slides[previewIndex]}
                        imageRef={previewImageRef}
                        onFileLoad={onPreviewFileLoad}
                        position={`${zeroPad(previewIndex + 1)} / ${zeroPad(slides.length)}`}
                      />
                    )}
                  </div>

                  {hasScrubber && (
                    <Scrubber
                      orientation="horizontal"
                      count={slides.length}
                      index={index!}
                      onIndexChange={commit}
                      onPreviewChange={setPreviewIndex}
                      /** On a phone the rail goes under the photo, in reach of a thumb, where it costs the photo no room. */
                      className="sm:hidden"
                    />
                  )}

                  {caption && (
                    <figcaption
                      ref={captionRef}
                      className={cn(
                        "flex justify-between gap-4 font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums",
                        /** The phone rail's touch area already spaces it from the photo. */
                        hasScrubber ? "sm:mt-3" : "mt-3",
                        dimming,
                      )}
                      style={{ opacity: dimmed }}
                    >
                      {caption}
                    </figcaption>
                  )}
                </figure>

                {hasScrubber && (
                  <Scrubber
                    count={slides.length}
                    index={index!}
                    onIndexChange={commit}
                    onPreviewChange={setPreviewIndex}
                    /** Height-gated as well as width-gated: a phone on its side is wide enough but too short for the preview. */
                    className="absolute top-1/2 left-0 hidden -translate-y-1/2 [@media(min-width:40rem)_and_(min-height:35rem)]:block"
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
