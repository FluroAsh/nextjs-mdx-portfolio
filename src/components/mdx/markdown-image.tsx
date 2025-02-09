import Image from "next/image";

import { cn } from "@/utils/misc";
import { getImagePlaceholder } from "@/server/image";
import { env } from "@/lib/env";

type MarkDownImageProps = React.ComponentProps<"img">;

export const MarkdownImage = async ({
  src,
  alt,
  ...props
}: MarkDownImageProps) => {
  if (!src || !alt)
    throw new Error("Images must include src and alt attributes");

  const {
    orientation,
    width: probedWidth,
    height: probedHeight,
    base64,
  } = await getImagePlaceholder(
    src,
    src.includes(env.basePath) ? "large" : undefined,
  );

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { width, height, ...newProps } = props; // removes unused width/height props

  return (
    <Image
      src={src}
      className={cn(
        /portrait|square/.test(orientation ?? "") && "w-[400px]",
        "rounded-sm max-w-full mx-auto transition-opacity",
      )}
      alt={alt}
      width={probedWidth}
      height={probedHeight}
      loading="lazy"
      placeholder="blur"
      blurDataURL={base64}
      // sizes="(max-width: 600px) 750px, 1000px"
      {...newProps}
    />
  );
};
