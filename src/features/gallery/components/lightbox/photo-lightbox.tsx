"use client";

import { useMemo } from "react";

import { downloadImage } from "@/components/lightbox/download-image";
import { Lightbox } from "@/components/lightbox/lightbox";

import type { GalleryPhoto, ResolvedCollection } from "../../types";
import { formatAspectRatio, frameNumber } from "../../utils";
import { DetailsPanel } from "./details-panel";

type PhotoLightboxProps = {
  /** The photos being browsed, in order; arrows move through these only. */
  photos: GalleryPhoto[];
  /** Index into `photos`; `null` when closed. */
  index: number | null;
  collections: ResolvedCollection[];
  shareUrl: (photo: GalleryPhoto) => string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onShowCollection: (slug: string) => void;
};

export const PhotoLightbox = ({
  photos,
  index,
  collections,
  shareUrl,
  onIndexChange,
  onClose,
  onShowCollection,
}: PhotoLightboxProps) => {
  const photo = index === null ? undefined : photos[index];
  const collection = collections.find((c) => c.slug === photo?.collection);
  const slides = useMemo(
    () =>
      photos.map(({ src, alt, width, height, placeholder }) => ({
        src,
        alt,
        width,
        height,
        placeholder,
      })),
    [photos],
  );

  return (
    <Lightbox
      slides={slides}
      index={index}
      onIndexChange={onIndexChange}
      onClose={onClose}
      scrubber
      /** The gallery moves focus to the tile last viewed, not the one first opened. */
      onCloseAutoFocus={(event) => event.preventDefault()}
      meta={[collection?.title, photo?.location?.label]
        .filter(Boolean)
        .join(" · ")}
      caption={
        photo && (
          <>
            <span className="truncate">
              {frameNumber(photo.frame)}
              {photo.location && ` — ${photo.location.label}`}
            </span>
            <span className="shrink-0">
              {formatAspectRatio(photo.width, photo.height)} · {photo.width} ×{" "}
              {photo.height}
            </span>
          </>
        )
      }
      aside={
        photo && (
          <DetailsPanel
            photo={photo}
            collection={collection}
            shareUrl={shareUrl(photo)}
            onDownload={() => downloadImage(photo.src, photo.title)}
            onShowCollection={onShowCollection}
          />
        )
      }
    />
  );
};
