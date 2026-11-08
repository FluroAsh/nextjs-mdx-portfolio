import { Metadata } from "next";

import { Gallery } from "@/features/gallery/components/gallery";
import { GalleryHeader } from "@/features/gallery/components/gallery-header";
import { getGallery } from "@/features/gallery/server/get-gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of my photography from my travels.",
};

export default async function GalleryPage() {
  const { photos, collections } = await getGallery();

  return (
    <div>
      <GalleryHeader total={photos.length} />
      {photos.length ? (
        <Gallery photos={photos} collections={collections} />
      ) : (
        <p className="py-24 text-center font-mono text-xs tracking-wider text-neutral-500 uppercase">
          No photos yet. Check back soon.
        </p>
      )}
    </div>
  );
}
