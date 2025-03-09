import { cn } from "@/utils/misc";

export const SectionTag = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "inline-block rounded-md border border-green-800/30 bg-black/40 px-3 py-1 text-xs font-medium tracking-wider text-green-400/80 uppercase",
        className,
      )}
    >
      {text}
    </div>
  );
};
