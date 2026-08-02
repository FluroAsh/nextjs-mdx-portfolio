import { cn } from "@/utils/misc";

type ImageCaptionProps = {
  caption: string;
  /**
   * Lays the caption over the bottom of the image instead of below it, for grid
   * tiles where the cell height is fixed and there is no room underneath.
   */
  overlay?: boolean;
  className?: string;
};

export const ImageCaption = ({
  caption,
  overlay = false,
  className,
}: ImageCaptionProps) => (
  <figcaption
    title={overlay ? caption : undefined}
    className={cn(
      // `mt-0!` beats prose's own figcaption margin, which would otherwise float the bar away from the image it sits under.
      "mt-0! block px-2",
      "bg-gradient-to-t from-neutral-900 to-neutral-800",
      "text-center text-neutral-400 italic",
      // Tiles size their caption from the grid cell, so the font size is left to cascade from the tile rather than set here.
      overlay
        ? "absolute bottom-0 left-0 w-full truncate py-1 whitespace-nowrap"
        : "py-2 text-xs tracking-wider",
      className,
    )}
  >
    {caption}
  </figcaption>
);
