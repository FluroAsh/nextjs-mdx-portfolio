import { ExpandIconHover } from "@/components/icons/expand-hover";
import { downsizedUrl } from "@/utils/image";
import { cn } from "@/utils/misc";

import { ImageCaption } from "../image-caption";
import { ResponsiveImage } from "../responsive-image";
import { type ImageProps } from "./collection.types";

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
  const newSrc = useLowerRes ? downsizedUrl(src) : src;

  return (
    <div
      className={cn("group relative", className)}
      data-type="image-collection"
    >
      <div className="relative overflow-hidden hover:cursor-pointer">
        <ResponsiveImage src={newSrc} alt={alt} />
        {caption && <ImageCaption caption={caption} />}
      </div>
      <ExpandIconHover />
    </div>
  );
};
