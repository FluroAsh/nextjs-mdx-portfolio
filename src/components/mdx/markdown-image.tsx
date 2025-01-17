import Image from "next/image";

import { cn } from "@/lib/utils";
import { getImagePlaceholder } from "@/server/image";
import { env } from "@/lib/env";

type MarkDownImageProps = React.ComponentProps<"img">;

export const MarkdownImage = async ({
  src,
  alt,
  ...props
}: {
  src: string | undefined;
  alt: string | undefined;
} & MarkDownImageProps) => {
  if (!src || !alt)
    throw new Error("Images must include src and alt attributes");

  const { orientation, aspectRatio, width, height, base64 } =
    await getImagePlaceholder(
      src,
      src.includes(env.basePath) ? "large" : undefined,
    );

  return (
    <Image
      src={src}
      className={cn(
        orientation === "portrait" && "w-[400px]",
        "rounded-sm max-w-full mx-auto transition-opacity",
      )}
      // Aspect ratio is required for the browser to reserve the correct space for the image
      // https://www.andreaverlicchi.eu/blog/aspect-ratio-modern-reserve-space-lazy-images-async-content-responsive-design/
      style={{ aspectRatio }}
      alt={alt}
      width={width as any}
      height={height as any}
      placeholder="blur"
      blurDataURL={base64}
      // sizes="(max-width: 600px) 750px, 1000px"
      {...props}
    />
  );
};
