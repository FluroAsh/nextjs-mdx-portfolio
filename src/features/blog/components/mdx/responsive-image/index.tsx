import { getImagePlaceholder } from "@/server/image";
import { srcSetCandidates } from "@/utils/image";

import { ClientImage } from "./client-image";

// React 19's types widen `src` to `string | Blob`; this component only ever
// takes a URL, which it probes on the server.
type ResponsiveImageProps = {
  src?: string;
} & Omit<React.ComponentProps<"img">, "src">;

/**
 * This component is server-side rendered and cannot be used in client-components.
 * If you want to use it in a client component, you must pass it using the children prop.
 */
export const ResponsiveImage = async ({
  src,
  alt,
  className = "rounded-none",
  ...props
}: ResponsiveImageProps) => {
  if (!src || !alt)
    throw new Error("Images must include src and alt attributes");

  const {
    orientation = "",
    width: probedWidth,
    height: probedHeight,
    measured,
    base64,
  } = await getImagePlaceholder(src);

  const { width, height, ...newProps } = props;

  // This needs to be generated on the server so it does not change when hydrating
  const imageId = crypto.randomUUID();

  return (
    <ClientImage
      imageId={imageId}
      src={src}
      alt={alt}
      width={probedWidth}
      height={probedHeight}
      orientation={orientation}
      candidates={srcSetCandidates(src, {
        width: probedWidth,
        height: probedHeight,
        measured,
      })}
      className={className}
      blurDataURL={base64}
      {...newProps}
    />
  );
};
