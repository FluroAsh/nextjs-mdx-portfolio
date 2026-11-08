"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/utils/misc";

import type { GalleryCollection, GalleryPhoto } from "../types";
import { CollectionFilter } from "./collection-filter";
import { PhotoLightbox } from "./lightbox/photo-lightbox";
import { Masonry } from "./masonry";
import { PhotoTile } from "./photo-tile";

const PAGE_SIZE = 24;

type GalleryProps = {
  photos: GalleryPhoto[];
  collections: GalleryCollection[];
};

/**
 * Filter and open photo live in the query string so a link reopens the same
 * view. `history.replaceState` rather than the router: the page is static, and
 * a router navigation would refetch it for a change only this component reads.
 */
const writeParams = (collection: string | null, photo: string | null) => {
  const url = new URL(window.location.href);
  for (const [key, value] of [
    ["collection", collection],
    ["photo", photo],
  ] as const) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, "", url);
};

export const Gallery = ({ photos, collections }: GalleryProps) => {
  const [collection, setCollection] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);
  /** Frame of the first tile added by "load more", which takes focus once rendered. */
  const [focusFrame, setFocusFrame] = useState<number | null>(null);

  const { collectionCounts, collectionCovers } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const photo of photos)
      counts[photo.collection] = (counts[photo.collection] ?? 0) + 1;
    const covers: Record<string, GalleryPhoto> = {};
    for (const { slug, cover } of collections)
      covers[slug] = photos.find((p) => p.id === cover)!;
    return { collectionCounts: counts, collectionCovers: covers };
  }, [photos, collections]);

  const filtered = useMemo(
    () =>
      collection ? photos.filter((p) => p.collection === collection) : photos,
    [collection, photos],
  );
  const visible = filtered.slice(0, visibleCount);
  const openIndex = openId ? filtered.findIndex((p) => p.id === openId) : -1;

  // The static page renders the unfiltered grid; a shared link narrows it once mounted.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedCollection = params.get("collection");
    const linkedPhoto = params.get("photo");
    const validCollection = collections.some((a) => a.slug === linkedCollection)
      ? linkedCollection
      : null;
    const pool = validCollection
      ? photos.filter((p) => p.collection === validCollection)
      : photos;
    const position = pool.findIndex((p) => p.id === linkedPhoto);

    /* eslint-disable react-hooks/set-state-in-effect -- reads the URL once, which the server cannot see */
    setCollection(validCollection);
    if (position >= 0) {
      setOpenId(linkedPhoto);
      setVisibleCount(Math.max(PAGE_SIZE, position + 1));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [collections, photos]);

  useEffect(() => {
    if (focusFrame === null) return;
    document
      .querySelector<HTMLElement>(`[data-frame="${focusFrame}"] button`)
      ?.focus();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hand-off after render
    setFocusFrame(null);
  }, [focusFrame]);

  const selectCollection = (slug: string | null) => {
    setCollection(slug);
    setVisibleCount(PAGE_SIZE);
    setOpenId(null);
    writeParams(slug, null);
  };

  const openPhoto = (id: string | null) => {
    setOpenId(id);
    writeParams(collection, id);
  };

  const loadMore = () => {
    setFocusFrame(filtered[visibleCount]?.frame ?? null);
    setVisibleCount((count) => count + PAGE_SIZE);
  };

  const remaining = filtered.length - visible.length;
  const progress = filtered.length ? visible.length / filtered.length : 1;

  return (
    <div className="max-w-frame mx-auto w-full px-6 pt-6">
      <CollectionFilter
        collections={collections.map((a) => ({
          ...a,
          count: collectionCounts[a.slug] ?? 0,
        }))}
        total={photos.length}
        active={collection}
        onChange={selectCollection}
      />

      <p className="mt-3 mb-5 font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums">
        Showing <span className="text-neutral-300">{visible.length}</span> of{" "}
        {filtered.length}
        {collection && (
          <>
            {" "}
            in{" "}
            <span className="text-green-400">
              {collections.find((a) => a.slug === collection)?.title}
            </span>
          </>
        )}
      </p>

      <Masonry
        photos={visible}
        renderTile={(photo) => (
          <div key={photo.id} data-frame={photo.frame}>
            <PhotoTile
              photo={photo}
              collectionTitle={
                collection
                  ? undefined
                  : collections.find((a) => a.slug === photo.collection)?.title
              }
              onOpen={() => openPhoto(photo.id)}
            />
          </div>
        )}
      />

      <div className="mx-auto mt-12 flex max-w-xs flex-col items-center gap-3 font-mono text-[10px] tracking-wider text-neutral-500 uppercase tabular-nums">
        <span>
          {visible.length} / {filtered.length} loaded
        </span>
        <span aria-hidden className="h-px w-full bg-green-500/15">
          <span
            className="block h-full bg-green-400 transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        {remaining > 0 ? (
          <button
            type="button"
            onClick={loadMore}
            className={cn(
              "mt-2 border border-green-500/40 px-5 py-2.5 text-[11px] text-green-300 uppercase",
              "transition-colors duration-150 ease-linear hover:border-green-400 hover:bg-green-500/10",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400",
            )}
          >
            Load more +{Math.min(remaining, PAGE_SIZE)}
          </button>
        ) : (
          <span className="mt-2 text-green-600">End of roll</span>
        )}
      </div>

      <PhotoLightbox
        photos={filtered}
        index={openIndex >= 0 ? openIndex : null}
        collections={collections}
        collectionCounts={collectionCounts}
        collectionCovers={collectionCovers}
        shareUrl={(photo) => {
          const url = new URL(window.location.href);
          url.search = "";
          url.searchParams.set("photo", photo.id);
          return url.toString();
        }}
        onIndexChange={(index) => {
          openPhoto(filtered[index].id);
          // Keeps the tile on the page, so closing can return focus to it.
          setVisibleCount((count) => Math.max(count, index + 1));
        }}
        onClose={() => {
          const frame = filtered[openIndex]?.frame;
          openPhoto(null);
          if (frame) setFocusFrame(frame);
        }}
        onShowCollection={selectCollection}
      />
    </div>
  );
};
