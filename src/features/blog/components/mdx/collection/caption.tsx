import { cn } from "@/utils/misc";

export const ImageCaption = ({
  caption,
  isFixed = false,
  styles,
}: {
  caption: string;
  isFixed?: boolean;
  styles?: string;
}) => {
  const className = cn(
    isFixed
      ? "absolute bottom-0 left-0 w-full translate-y-1/2 rounded-b-md"
      : "",
    styles,
  );

  return (
    <figcaption
      title={caption}
      className={cn(
        "truncate bg-gradient-to-t from-neutral-900 to-neutral-800 px-2 py-1 text-center text-xs whitespace-nowrap text-neutral-400 italic",
        className,
      )}
    >
      {caption}
    </figcaption>
  );
};
