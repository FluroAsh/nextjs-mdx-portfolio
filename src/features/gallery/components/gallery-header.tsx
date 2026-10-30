import { BilingualLabel } from "@/components/bilingual-label";
import { ScanlinePlane } from "@/components/scanline-plane";

import { GALLERY_LABELS } from "../labels";

type GalleryHeaderProps = {
  /** Every photo in the gallery, not just the ones on screen. */
  total: number;
};

export const GalleryHeader = ({ total }: GalleryHeaderProps) => (
  // Same plane as the post header, so the gallery reads as part of the site
  // rather than a separate app.
  <header className="bg-surface-section relative isolate overflow-hidden border-b border-green-500/20">
    <ScanlinePlane />

    <div className="max-w-frame relative z-30 mx-auto flex items-end justify-between gap-6 px-6 py-8 sm:py-10">
      <div>
        <BilingualLabel {...GALLERY_LABELS.gallery} />
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-2 max-w-md text-neutral-400">
          The full frames behind the posts. Mostly Japan and China, a lot of it
          after dark.
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="font-mono text-4xl leading-none text-neutral-100 tabular-nums sm:text-5xl">
          {total}
        </span>
        <BilingualLabel {...GALLERY_LABELS.frames} className="mt-2" />
      </div>
    </div>
  </header>
);
