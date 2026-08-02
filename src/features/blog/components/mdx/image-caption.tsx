import { cn } from "@/utils/misc";

type ImageCaptionProps = {
  caption: string;
  className?: string;
};

export const ImageCaption = ({ caption, className }: ImageCaptionProps) => (
  <figcaption
    title={caption}
    className={cn(
      "clip-chamfer absolute bottom-2 left-2 z-20 max-w-[calc(100%-16px)]",
      "truncate px-2.5 py-1 backdrop-blur-sm",
      "bg-surface-page/85 font-mono text-[10px] tracking-wider text-green-400 uppercase",
      className,
    )}
  >
    {caption}
  </figcaption>
);
