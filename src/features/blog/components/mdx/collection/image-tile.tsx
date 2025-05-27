import { ExpandIcon } from "lucide-react";

import { IMAGE_SIZE, type ImageProps } from "@/types";
import { MarkdownImage } from "../markdown-image";
import { ImageCaption } from "./caption";

export const ImageTile = ({
  src,
  alt,
  caption,
  useLowerRes = false,
}: ImageProps) => {
  const newSrc = useLowerRes
    ? src.replace(IMAGE_SIZE.LARGE, IMAGE_SIZE.MEDIUM)
    : src;

  return (
    <div className="mt-4 mb-7" data-type="collection">
      <div className="group relative hover:cursor-pointer">
        <MarkdownImage src={newSrc} alt={alt} className="rounded-md" />
        {caption && <ImageCaption caption={caption} isFixed />}

        <div className="user-select-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-black/50 p-3">
            <ExpandIcon className="size-4 fill-neutral-100 stroke-neutral-100" />
          </span>
        </div>
      </div>
    </div>
  );
};
