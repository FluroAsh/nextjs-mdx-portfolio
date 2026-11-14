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
/** Width of the scrub preview at its largest, so it draws on a small file. */
const PREVIEW_SIZES = "24rem";

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

type ScrubPreviewProps = {
  slide: LightboxSlide;
  /** Where the slide sits in the set, e.g. `029 / 121`. */
  position: string;
  /** The preview image, so the lightbox can start the photo's entrance from where it sat. */
  imageRef: React.Ref<HTMLImageElement>;
};

/** Where a photo of the given width-to-height ratio sits inside an `object-contain` image, which letterboxes it within the element's box. */
const containedRect = (image: HTMLImageElement, ratio: number) => {
  const box = image.getBoundingClientRect();
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;
  return new DOMRect(
    box.left + (box.width - width) / 2,
    box.top + (box.height - height) / 2,
    width,
    height,
  );
};

/** What the scrubber is passing, in a frame of fixed size over the photo on show. */
const ScrubPreview = ({ slide, position, imageRef }: ScrubPreviewProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === slide.src;

  return (
    <div
      aria-hidden
      className="plate-ticks bg-surface-page/90 pointer-events-none absolute top-1/2 left-1/2 z-10 flex size-72 -translate-x-1/2 -translate-y-1/2 flex-col gap-2 p-2 outline outline-green-500/40 backdrop-blur-sm lg:size-96"
    >
      <div
        className="relative min-h-0 flex-1 bg-contain bg-center bg-no-repeat"
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
          sizes={slide.srcSet && PREVIEW_SIZES}
          ref={imageRef}
          alt=""
          onLoad={() => setLoadedSrc(slide.src)}
          className={cn(
            "absolute inset-0 size-full object-contain",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <p className="font-mono text-[10px] tracking-wider text-neutral-400 tabular-nums">
        {position}
      </p>
    </div>
  );
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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const previewImage = useRef<HTMLImageElement>(null);
  /** Where the scrub preview's photo sat when the scrub ended; the photo enters the frame from there. */
  const entrance = useRef<DOMRect | null>(null);
  /** The file the preview had loaded for a slide, shown until the full one arrives so the entrance does not drop back to the blur. */
  const [carried, setCarried] = useState<{ src: string; url: string }>();

  /** Closing mid-scrub unmounts the scrubber before it can end the preview. */
  if (!slide && previewIndex !== null) setPreviewIndex(null);

  const handlePreviewChange = (next: number | null) => {
    const image = previewImage.current;
    /** Measured here, while the preview is still on the page. */
    if (next === null && image && previewIndex !== null) {
      const { src, width, height } = slides[previewIndex];
      /** `complete` is false while the element still shows the photo before this one. */
      const hasLoaded = image.complete && image.naturalWidth > 0;
      const ratio =
        width && height
          ? width / height
          : hasLoaded && image.naturalWidth / image.naturalHeight;
      entrance.current = ratio ? containedRect(image, ratio) : null;
      if (hasLoaded) setCarried({ src, url: image.currentSrc });
    }
    setPreviewIndex(next);
  };

  /** The photo grows out of the preview into its place: the same picture at the same shape, so one transform covers it. */
  useLayoutEffect(() => {
    const from = entrance.current;
    const frame = frameRef.current;
    if (previewIndex !== null || !from || !frame) return;
    entrance.current = null;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = frame.getBoundingClientRect();
    const start = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    frame.animate(
      [
        { transformOrigin: "top left", transform: start },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: 250, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
  }, [previewIndex]);

  const isSeries = slides.length > 1;
  const hasScrubber = scrubber && isSeries;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < slides.length - 1;
  const goPrev = () => hasPrev && onIndexChange(index - 1);
  const goNext = () => hasNext && onIndexChange(index + 1);

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
  const backdropUrl =
    carried?.src === slide?.src ? carried?.url : slide?.placeholder;
  const backdrop = backdropUrl ? `url(${backdropUrl})` : undefined;

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
                    /** Dims with a fade, but returns at once: the photo's entrance is the transition out. */
                    previewIndex !== null &&
                      "opacity-30 transition-opacity duration-150 ease-linear",
                  )}
                >
                  <div
                    ref={frameRef}
                    /** Sized by the image, so the ticks sit on its corners. */
                    className="plate-ticks relative mx-auto w-fit max-w-full bg-cover bg-center"
                    style={{ backgroundImage: isLoaded ? undefined : backdrop }}
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
                        "block h-auto w-auto max-w-full border border-green-500/25 object-contain",
                        aside
                          ? "max-h-[62dvh] lg:max-h-[calc(100dvh-180px)]"
                          : "max-h-[calc(100dvh-180px)]",
                        "transition-opacity duration-200",
                        isLoaded ? "opacity-100" : "opacity-0",
                      )}
                    />
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
                    onPreviewChange={handlePreviewChange}
                    className="absolute top-1/2 left-0 hidden -translate-y-1/2 sm:block"
                  />
                )}

                {previewIndex !== null && slides[previewIndex] && (
                  <ScrubPreview
                    slide={slides[previewIndex]}
                    imageRef={previewImage}
                    position={`${zeroPad(previewIndex + 1)} / ${zeroPad(slides.length)}`}
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
