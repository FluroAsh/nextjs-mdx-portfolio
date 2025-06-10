import { ExpandIcon } from "lucide-react";

import { IMAGE_SIZE } from "@/types";
import { MarkdownImage } from "../markdown-image";
import { ImageCaption } from "./caption";

import { type ImageProps } from "./collection.types";
import { cn } from "@/utils/misc";

const ExpandIconHover = () => (
  <div className="user-select-none absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:cursor-pointer group-hover:opacity-100">
    <span className="rounded-full bg-black/50 p-3">
      <ExpandIcon className="size-4 fill-neutral-100 stroke-neutral-100" />
    </span>
  </div>
);

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
