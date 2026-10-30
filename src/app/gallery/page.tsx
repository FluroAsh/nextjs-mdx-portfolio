import { Metadata } from "next";

import { Gallery } from "@/features/gallery/components/gallery";
import { GalleryHeader } from "@/features/gallery/components/gallery-header";
import { getGallery } from "@/features/gallery/server/get-gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of my photography from my travels.",
};

export default async function GalleryPage() {
  const { photos, albums } = await getGallery();

  return (
    <div>
      <GalleryHeader total={photos.length} />
      <Gallery photos={photos} albums={albums} />
    </div>
  );
}
