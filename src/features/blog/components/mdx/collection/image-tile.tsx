import { IMAGE_SIZE } from "@/types";
import { ExpandIconHover } from "@/components/icons/expand-hover";
import { MarkdownImage } from "../markdown-image";
import { ImageCaption } from "./caption";

import { type ImageProps } from "./collection.types";
import { cn } from "@/utils/misc";

type ImageTileProps = ImageProps & {
  className?: string;
};

export const ImageTile = ({
  src,
  alt,
  caption,
  useLowerRes = false,
  className,
}: ImageTileProps) => {
  const newSrc = useLowerRes
    ? src.replace(IMAGE_SIZE.LARGE, IMAGE_SIZE.MEDIUM)
    : src;

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      data-type="image-collection"
    >
      <div className="overflow-hidden rounded-[5.5px] hover:cursor-pointer">
        <MarkdownImage src={newSrc} alt={alt} />
        {caption && (
          <ImageCaption caption={caption} isFixed className="rounded-b-sm" />
        )}
      </div>
      <ExpandIconHover />
    </div>
  );
};
