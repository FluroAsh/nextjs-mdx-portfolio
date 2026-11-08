import { allBlogContent } from "@/data/content";
import { env } from "@/lib/env";
import { requireManifest } from "@/server/image";
import { parseImageUrl, variantUrl } from "@/utils/image";

import type { GalleryCollection, GalleryPhoto } from "../types";

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

type Gallery = { photos: GalleryPhoto[]; collections: GalleryCollection[] };

const fetchCollections = async (): Promise<CollectionsFile | null> => {
  const url = `${env.imageOrigin}/gallery/collections.json`;
  const res = await fetch(url).catch((cause) => {
    throw new Error(`${url}: request failed`, { cause });
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
};

export const getGallery = async (): Promise<Gallery> => {
  const file = await fetchCollections();
  if (!file) return { photos: [], collections: [] };

  const seen = new Set<string>();
  const photos: GalleryPhoto[] = [];
  const collections: GalleryCollection[] = [];

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
        const original = parseImageUrl(
          `${env.imageOrigin}/${set}/${name}.webp`,
        )!;
        const src = variantUrl(original, "large");
        const manifest = await requireManifest(src);

        if (!alt) console.warn(`Missing alt text: ${set}`);

        return {
          id: set,
          src,
          width: manifest.width,
          height: manifest.height,
          measured: manifest.measured,
          candidates: manifest.candidates,
          placeholder: manifest.base64,
          title: alt ?? "",
          alt: alt ?? "",
          caption: caption ?? undefined,
          tags,
          collection: collection.slug,
        } satisfies Omit<GalleryPhoto, "frame">;
      }),
    );

    photos.push(
      ...collectionPhotos.map((photo, i) => ({
        ...photo,
        // Frames number the whole gallery, so a photo keeps its number under any filter.
        frame: photos.length + i + 1,
      })),
    );
    collections.push({
      slug: collection.slug,
      title: collection.name,
      cover: collection.cover ?? collection.photos[0].set,
      postPath: collection.post && `/blog/${collection.post}`,
      series: collection.series,
    });
  }

  return { photos, collections };
};
