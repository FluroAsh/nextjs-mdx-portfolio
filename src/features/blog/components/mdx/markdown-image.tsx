import Image from "next/image";

import { cn } from "@/utils/misc";
import { getImagePlaceholder } from "@/server/image";
import { env } from "@/lib/env";
import { IMAGE_SIZE } from "@/types";

type MarkDownImageProps = React.ComponentProps<"img">;

/**
 * This component is server-side rendered and cannot be used in client-components.
 * If you want to use it in a client component, you must pass it using the children prop.
 */
export const MarkdownImage = async ({
  src,
  alt,
  className,
  ...props
}: MarkDownImageProps) => {
  if (!src || !alt)
    throw new Error("Images must include src and alt attributes");

  // If src contains an active S3 origin, use it to handle image resizing from source image -> "large" variant.
  const s3Origin = [env.baseS3Origin, env.secondaryS3Origin].filter(
    (path) => path && src.startsWith(path),
  )[0];

  const {
    orientation,
    width: probedWidth,
    height: probedHeight,
    base64,
  } = await getImagePlaceholder(
    src,
    s3Origin,
    s3Origin ? IMAGE_SIZE.LARGE : undefined,
  );

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { width, height, ...newProps } = props; // removes unused width/height props

  return (
    <Image
      src={src}
      className={cn(
        /portrait|square/.test(orientation ?? "") && "w-[400px]",
        "mx-auto max-w-full rounded-sm transition-opacity",
        className,
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
