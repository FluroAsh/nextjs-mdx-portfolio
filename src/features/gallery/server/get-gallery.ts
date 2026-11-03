import { allBlogContent } from "@/data/content";
import { env } from "@/lib/env";
import { FETCH_FAILED, readManifest } from "@/server/image";

import type { GalleryAlbum, GalleryPhoto } from "../types";

/** The fields the site reads from `gallery/collections.json` (upload service schema 1). */
type CollectionsFile = {
  schema: 1;
  collections: {
    slug: string;
    name: string;
    series?: string;
    /** A post slug in this repo. */
    post?: string;
    /** A set in this collection; the first photo when absent. */
    cover?: string;
    photos: {
      /** CDN path of the set, e.g. `japan-2025/tokyo/day-1/name` or `legacy/name`. */
      set: string;
      alt: string | null;
      caption: string | null;
      tags: string[];
    }[];
  }[];
};

type Gallery = { photos: GalleryPhoto[]; albums: GalleryAlbum[] };

const fetchCollections = async (): Promise<CollectionsFile | null> => {
  const res = await fetch(`${env.imageOrigin}/gallery/collections.json`);
  // The CDN answers 403 for a missing key, so both mean no file yet; any other failure must not ship an empty gallery.
  if (res.status === 403 || res.status === 404) return null;
  if (!res.ok) throw new Error(`collections.json: HTTP ${res.status}`);
  return res.json();
};

export const getGallery = async (): Promise<Gallery> => {
  const file = await fetchCollections();
  if (!file) return { photos: [], albums: [] };

  const seen = new Set<string>();
  const photos: GalleryPhoto[] = [];
  const albums: GalleryAlbum[] = [];

  for (const collection of file.collections) {
    if (
      collection.post &&
      !allBlogContent.some((p) => p.slug === collection.post)
    )
      throw new Error(
        `Collection "${collection.slug}": post "${collection.post}" is not a blog post`,
      );
    if (
      collection.cover &&
      !collection.photos.some((p) => p.set === collection.cover)
    )
      throw new Error(
        `Collection "${collection.slug}": cover "${collection.cover}" is not in the collection`,
      );

    const collectionPhotos = await Promise.all(
      collection.photos.map(async ({ set, alt, caption, tags }) => {
        if (seen.has(set)) throw new Error(`Set listed twice: ${set}`);
        seen.add(set);

        const name = set.split("/").at(-1)!;
        const src = `${env.imageOrigin}/${set}/large_${name}.webp`;
        const measured = await readManifest(src);
        if (!measured || measured === FETCH_FAILED)
          throw new Error(`Set has no usable manifest: ${set}`);

        if (!alt) console.warn(`Missing alt text: ${set}`);

        return {
          id: set,
          src,
          width: measured.width,
          height: measured.height,
          measured: measured.measured,
          candidates: measured.candidates,
          placeholder: measured.base64,
          frame: 0,
          title: alt ?? "",
          alt: alt ?? "",
          caption: caption ?? undefined,
          tags,
          album: collection.slug,
        } satisfies GalleryPhoto;
      }),
    );

    photos.push(...collectionPhotos);
    albums.push({
      slug: collection.slug,
      title: collection.name,
      postPath: collection.post && `/blog/${collection.post}`,
      series: collection.series,
    });
  }

  // Frames number the whole gallery, so a photo keeps its number under any filter.
  photos.forEach((photo, i) => (photo.frame = i + 1));

  return { photos, albums };
};
