import { cn } from "@/utils/misc";

type ImageCaptionProps = {
  caption: string;
  className?: string;
};

export const ImageCaption = ({ caption, className }: ImageCaptionProps) => (
  <figcaption className={cn("image-caption", className)}>{caption}</figcaption>
);
