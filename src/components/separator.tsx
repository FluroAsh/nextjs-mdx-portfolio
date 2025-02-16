import { cn } from "@/utils/misc";

type SeparatorProps = {
  className?: string;
  from?:
    | `from-${string}-${number}`
    | `from-${string}-${number}/${number}`
    | "from-transparent";
  via?: `via-${string}-${number}` | `via-${string}-${number}/${number}`;
  to?:
    | `to-${string}-${number}`
    | `to-${string}-${number}/${number}`
    | "to-transparent";
};

export const Separator = ({
  className,
  from = "from-transparent",
  via = "via-green-600",
  to = "to-transparent",
}: SeparatorProps) => (
  <div
    className={cn("my-2 h-[2px] bg-gradient-to-r", to, via, from, className)}
  />
);
