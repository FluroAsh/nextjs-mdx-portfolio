import { cn } from "@/utils/misc";

export const ImageCaption = ({
  caption,
  isFixed = false,
  className,
}: {
  caption: string;
  isFixed?: boolean;
  className?: string;
}) => (
  <figcaption
    title={caption}
    className={cn(
      "truncate bg-gradient-to-t from-neutral-900 to-neutral-800 px-2 py-1 text-center whitespace-nowrap text-neutral-400 italic",
      isFixed ? "absolute bottom-0 left-0 w-full" : "",
      className,
    )}
  >
    {caption}
  </figcaption>
);
