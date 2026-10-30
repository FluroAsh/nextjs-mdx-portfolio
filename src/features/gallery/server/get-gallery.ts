import { env } from "@/lib/env";
import { getImagePlaceholder } from "@/server/image";
import { srcSetCandidates } from "@/utils/image";

import { ALBUMS } from "../data/albums";
import { PHOTO_ENTRIES } from "../data/photos";
import type { GalleryAlbum, GalleryPhoto } from "../types";

/** The set's name: the folder of a nested key, the file stem of a flat one. */
const idFromKey = (key: string) => {
  const segments = key.split("/");
  return segments.length > 2 &&
    segments.at(-1)?.endsWith(`_${segments.at(-2)}.webp`)
    ? segments.at(-2)!
    : segments.at(-1)!.replace(/\.\w+$/, "");
};

/**
 * Size and blur come from the probe for now. Issue #8 swaps that for the
 * manifest behind the same call, so nothing here changes when it lands.
 */
export const getGallery = async (): Promise<{
  photos: GalleryPhoto[];
  albums: GalleryAlbum[];
}> => {
  const photos = await Promise.all(
    PHOTO_ENTRIES.map(async ({ key, title, ...entry }, i) => {
      const src = `${env.imageOrigin}/${key}`;
      const { width, height, measured, base64 } =
        await getImagePlaceholder(src);

      return {
        ...entry,
        id: idFromKey(key),
        src,
        width,
        height,
        measured,
        candidates: srcSetCandidates(src, { width, height, measured }),
        placeholder: base64,
        frame: i + 1,
        title: title ?? entry.alt,
      } satisfies GalleryPhoto;
    }),
  );

  // An album with nothing in it would be a filter that empties the page.
  const albums = ALBUMS.filter((album) =>
    photos.some((photo) => photo.album === album.slug),
  );

  return { photos, albums };
};
