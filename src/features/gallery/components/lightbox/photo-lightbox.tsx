"use client";

import { useEffect, useRef, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { altToFilename } from "@/utils/image";
import { cn, zeroPad } from "@/utils/misc";

import type { GalleryAlbum, GalleryPhoto } from "../../types";
import { formatAspectRatio, frameNumber } from "../../utils";
import { DetailsPanel, type RelatedAlbum } from "./details-panel";
import { IconButton } from "./icon-button";

/** Horizontal travel in pixels before a touch counts as a swipe. */
const SWIPE_DISTANCE = 50;

type PhotoLightboxProps = {
  /** The photos being browsed, in order; arrows move through these only. */
  photos: GalleryPhoto[];
  /** Index into `photos`; `null` when closed. */
  index: number | null;
  albums: GalleryAlbum[];
  /** Photo counts per album slug. */
  albumCounts: Record<string, number>;
  /** First photo of each album, for related thumbnails. */
  albumCovers: Record<string, GalleryPhoto>;
  shareUrl: (photo: GalleryPhoto) => string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onShowAlbum: (slug: string) => void;
};

/** Cross-origin `download` attributes are ignored, so the file is fetched and saved as a blob. */
const downloadPhoto = async (photo: GalleryPhoto) => {
  try {
    // ?: Search param is required for CORS, see: https://yet-another-react-lightbox.com/plugins/download#Cross-OriginImages
    const response = await fetch(`${photo.src}?download`);
    if (!response.ok) throw new Error(String(response.status));
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${altToFilename(photo.title)}.webp`;
    anchor.click();
    URL.revokeObjectURL(url);
  } catch {
    window.open(photo.src, "_blank", "noopener");
  }
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="border border-green-500/30 px-1.5 py-0.5 text-neutral-300">
    {children}
  </kbd>
);

const relatedAlbums = (
  current: GalleryAlbum | undefined,
  albums: GalleryAlbum[],
  counts: Record<string, number>,
  covers: Record<string, GalleryPhoto>,
): RelatedAlbum[] => {
  const others = albums.filter((album) => album.slug !== current?.slug);
  // Same series first; any other album only fills the space left over.
  const sameSeries = others.filter(
    (album) => current?.series && album.series === current.series,
  );
  return [...sameSeries, ...others.filter((a) => !sameSeries.includes(a))]
    .slice(0, 2)
    .map((album) => ({
      ...album,
      count: counts[album.slug],
      cover: covers[album.slug],
    }));
};

export const PhotoLightbox = ({
  photos,
  index,
  albums,
  albumCounts,
  albumCovers,
  shareUrl,
  onIndexChange,
  onClose,
  onShowAlbum,
}: PhotoLightboxProps) => {
  const photo = index === null ? undefined : photos[index];
  const touchStartX = useRef<number | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < photos.length - 1;
  const goPrev = () => hasPrev && onIndexChange(index - 1);
  const goNext = () => hasNext && onIndexChange(index + 1);

  // Neighbours load while this one is viewed, so stepping through is instant.
  useEffect(() => {
    if (index === null) return;
    for (const neighbour of [photos[index - 1], photos[index + 1]]) {
      if (neighbour) new Image().src = neighbour.src;
    }
  }, [index, photos]);

  const album = albums.find((a) => a.slug === photo?.album);
  const isLoaded = loadedId === photo?.id;

  return (
    <Dialog.Root open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm" />
        {photo && (
          <Dialog.Content
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") goPrev();
              if (event.key === "ArrowRight") goNext();
            }}
            // Focus would land on the copy button otherwise, and an arrow key
            // press needs the dialog itself focused anyway.
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              (event.currentTarget as HTMLElement).focus();
            }}
            // The gallery moves focus to the tile last viewed, not the one first opened.
            onCloseAutoFocus={(event) => event.preventDefault()}
            className={cn(
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[60] outline-none",
              "flex flex-col overflow-y-auto overscroll-contain",
              "lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden",
            )}
          >
            <section
              aria-label="Photo"
              className="relative flex shrink-0 flex-col lg:h-dvh"
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
                  <span className="text-green-400">{zeroPad(index! + 1)}</span>
                  <span className="mx-1.5 text-green-700">/</span>
                  {zeroPad(photos.length)}
                </span>
                <span className="hidden truncate text-neutral-400 lg:block">
                  {[album?.title, photo.location?.label]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span aria-hidden className="text-neutral-500 lg:hidden">
                  Swipe ← →
                </span>
                <Dialog.Close asChild>
                  <IconButton label="Close" className="lg:hidden">
                    <X />
                  </IconButton>
                </Dialog.Close>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-2 sm:px-20 lg:pb-0">
                <figure className="flex max-h-full max-w-full flex-col">
                  <div
                    // Sized by the image, so the ticks sit on its corners.
                    className="plate-ticks relative mx-auto w-fit max-w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        !isLoaded && photo.placeholder
                          ? `url(${photo.placeholder})`
                          : undefined,
                    }}
                  >
                    <img
                      key={photo.id}
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      onLoad={() => setLoadedId(photo.id)}
                      draggable={false}
                      className={cn(
                        "block h-auto max-h-[62dvh] w-auto max-w-full border border-green-500/25 object-contain lg:max-h-[calc(100dvh-180px)]",
                        "transition-opacity duration-200",
                        isLoaded ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                  <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums">
                    <span className="truncate">
                      {frameNumber(photo.frame)}
                      {photo.location && ` — ${photo.location.label}`}
                    </span>
                    {/* A guessed size would read as a fact here. */}
                    {photo.measured && (
                      <span className="shrink-0">
                        {formatAspectRatio(photo.width, photo.height)} ·{" "}
                        {photo.width} × {photo.height}
                      </span>
                    )}
                  </figcaption>
                </figure>

                <IconButton
                  label="Previous photo"
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="absolute top-1/2 left-2 hidden -translate-y-1/2 sm:grid lg:left-6 lg:size-12"
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  label="Next photo"
                  onClick={goNext}
                  disabled={!hasNext}
                  className="absolute top-1/2 right-2 hidden -translate-y-1/2 sm:grid lg:right-6 lg:size-12"
                >
                  <ChevronRight />
                </IconButton>
              </div>

              <p
                aria-hidden
                className="hidden items-center justify-center gap-2 py-5 font-mono text-[10px] tracking-wider text-neutral-500 uppercase lg:flex"
              >
                <Kbd>←</Kbd>
                <Kbd>→</Kbd>
                <span className="mr-2">Nav</span>
                <Kbd>Esc</Kbd>
                <span>Close</span>
              </p>
            </section>

            <DetailsPanel
              photo={photo}
              album={album}
              related={relatedAlbums(album, albums, albumCounts, albumCovers)}
              shareUrl={shareUrl(photo)}
              onDownload={() => downloadPhoto(photo)}
              onShowAlbum={onShowAlbum}
            />
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};
