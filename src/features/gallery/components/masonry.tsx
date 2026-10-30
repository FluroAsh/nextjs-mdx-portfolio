"use client";

import { useColumnCount } from "../hooks/use-column-count";
import type { GalleryPhoto } from "../types";
import { distributeColumns } from "../utils";

/** The caption under a tile, in units of column width. */
const CAPTION_HEIGHT = 0.22;

type MasonryProps = {
  photos: GalleryPhoto[];
  renderTile: (photo: GalleryPhoto) => React.ReactNode;
};

export const Masonry = ({ photos, renderTile }: MasonryProps) => {
  const columnCount = useColumnCount();

  // Server render and first paint: CSS columns need no viewport width, so the
  // page has its shape before hydration. They give way to the stable layout.
  if (columnCount === null) {
    return (
      <div className="fold:columns-4 columns-2 gap-3 *:mb-4 *:break-inside-avoid sm:columns-3">
        {photos.map(renderTile)}
      </div>
    );
  }

  const columns = distributeColumns(photos, columnCount, CAPTION_HEIGHT);

  return (
    <div className="flex items-start gap-3">
      {columns.map((column, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-4">
          {column.map(renderTile)}
        </div>
      ))}
    </div>
  );
};
