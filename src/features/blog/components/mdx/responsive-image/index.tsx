import { getImagePlaceholder } from "@/server/image";

import { ClientImage } from "./client-image";

// React 19's types widen `src` to `string | Blob`; this component only ever
// takes a URL, which it probes on the server.
type ResponsiveImageProps = {
  src?: string;
  isLightboxImage?: boolean;
} & Omit<React.ComponentProps<"img">, "src">;

/**
 * This component is server-side rendered and cannot be used in client-components.
 * If you want to use it in a client component, you must pass it using the children prop.
 */
export const ResponsiveImage = async ({
  src,
  alt,
  className = "rounded-none",
  isLightboxImage = false,
  ...props
}: ResponsiveImageProps) => {
  if (!src || !alt)
    throw new Error("Images must include src and alt attributes");

  // TODO: Placeholders should be pre-generated ideally, will come back to this... probably.
  // Get placeholder data for blur effect
  const {
    orientation = "",
    width: probedWidth,
    height: probedHeight,
    base64,
  } = await getImagePlaceholder(src);

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { width, height, ...newProps } = props; // removes unused width/height props

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
      isLightboxImage={isLightboxImage}
      className={className}
      blurDataURL={base64}
      {...newProps}
    />
  );
};
