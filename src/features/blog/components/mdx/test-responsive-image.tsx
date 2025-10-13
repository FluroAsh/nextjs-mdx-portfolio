import { env } from "@/lib/env";
import { getImagePlaceholder } from "@/server/image";
import { IMAGE_SIZE } from "@/types";
import { getFileNameFromUrl } from "@/utils/image";
import { cn } from "@/utils/misc";

type ResponsiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  isLightboxImage?: boolean;
  priority?: boolean;
  sizes?: string;
} & Omit<React.ComponentProps<"img">, "src" | "alt" | "width" | "height">;

/**
 * Enhanced responsive image component with CloudFront caching and optimized srcset.
 * This component provides:
 * - Responsive images with proper srcset
 * - WebP/AVIF format support
 * - CloudFront-cached placeholders
 * - Smooth loading transitions
 * - Accessibility features
 */
export const ResponsiveImage = async ({
  src,
  alt,
  className = "rounded-sm",
  isLightboxImage = false,
  priority = false,
  sizes,
  ...props
}: ResponsiveImageProps) => {
  if (!src || !alt) {
    throw new Error("Images must include src and alt attributes");
  }

  // Determine S3 origin for image variants
  const s3Origin = [env.baseS3Origin, env.secondaryS3Origin].filter(
    (path) => path && src.startsWith(path),
  )[0];

  // Get placeholder data from CloudFront cache
  const placeholderData = await getImagePlaceholder(
    src,
    s3Origin,
    s3Origin ? IMAGE_SIZE.LARGE : undefined,
  );

  // Generate responsive image variants
  const generateImageUrl = (
    size: IMAGE_SIZE,
    format: "webp" | "jpeg" = "webp",
  ) => {
    if (!s3Origin) return src;
    const fileName = getFileNameFromUrl(src);
    const baseUrl = `${s3Origin}/${size}_${fileName}`;
    return format === "webp" ? baseUrl : baseUrl.replace(/\.webp$/, ".jpg");
  };

  // Create responsive srcset for different screen sizes and formats
  const createSrcSet = (format: "webp" | "jpeg") =>
    [
      `${generateImageUrl(IMAGE_SIZE.THUMBNAIL, format)} 320w`,
      `${generateImageUrl(IMAGE_SIZE.MEDIUM, format)} 640w`,
      `${generateImageUrl(IMAGE_SIZE.LARGE, format)} 1200w`,
      `${generateImageUrl(IMAGE_SIZE.LARGE, format)} 1920w`,
    ].join(", ");

  // Default sizes attribute - based on viewport width, not container
  const defaultSizes = isLightboxImage
    ? "100vw"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px";

  const imageSizes = sizes || defaultSizes;

  // Fallback src for older browsers
  const fallbackSrc = s3Origin
    ? generateImageUrl(IMAGE_SIZE.LARGE, "jpeg")
    : src;

  return (
    <picture className={cn("block", className)}>
      {/* AVIF sources for ultra-modern browsers (best compression) */}
      <source
        srcSet={createSrcSet("webp").replace(/\.webp/g, ".avif")}
        sizes={imageSizes}
        type="image/avif"
      />

      {/* WebP sources for modern browsers */}
      <source
        srcSet={createSrcSet("webp")}
        sizes={imageSizes}
        type="image/webp"
      />

      {/* JPEG fallback for older browsers */}
      <source
        srcSet={createSrcSet("jpeg")}
        sizes={imageSizes}
        type="image/jpeg"
      />

      {/* Fallback img element with enhanced loading states */}
      <img
        src={fallbackSrc}
        alt={alt}
        width={placeholderData.width}
        height={placeholderData.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          // Responsive sizing
          /portrait|square/.test(placeholderData.orientation ?? "") &&
            "w-[400px]",
          "mx-auto max-w-full",

          // Loading states
          "transition-opacity duration-300",
          "opacity-0",
          "data-[loaded=true]:opacity-100",

          // Blur effect during loading
          "blur-sm",
          "data-[loaded=true]:blur-none",
        )}
        style={{
          // CloudFront-cached placeholder as background
          backgroundImage: placeholderData.base64
            ? `url(${placeholderData.base64})`
            : `url(data:image/svg+xml;base64,${Buffer.from(
                `<svg width="${placeholderData.width}" height="${placeholderData.height}" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                  <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">Loading...</text>
                </svg>`,
              ).toString("base64")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          aspectRatio: placeholderData.aspectRatio,
        }}
        onLoad={(e) => {
          e.currentTarget.setAttribute("data-loaded", "true");
        }}
        onError={(e) => {
          // Fallback to a simple placeholder on error
          e.currentTarget.style.backgroundImage = `url(data:image/svg+xml;base64,${Buffer.from(
            `<svg width="${placeholderData.width}" height="${placeholderData.height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Image unavailable</text>
            </svg>`,
          ).toString("base64")})`;
          e.currentTarget.setAttribute("data-loaded", "true");
        }}
        {...props}
      />
    </picture>
  );
};

/**
 * Lightweight version for simple use cases
 */
export const SimpleResponsiveImage = async ({
  src,
  alt,
  className,
  ...props
}: Omit<ResponsiveImageProps, "isLightboxImage" | "priority" | "sizes">) => {
  return (
    <ResponsiveImage src={src} alt={alt} className={className} {...props} />
  );
};
