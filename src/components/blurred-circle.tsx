import { cn } from "@/utils/misc";

type BlurredCircleProps = {
  size?: number;
  blur?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  className?: string;
};

export const BlurredCircle = ({
  size = 150,
  blur = 80,
  top,
  left,
  bottom,
  right,
  className,
}: BlurredCircleProps) => (
  <div
    className={cn("absolute rounded-full bg-green-500/3", className)}
    style={{
      filter: `blur(${blur}px)`,
      top,
      bottom,
      left,
      right,
      width: size,
      height: size,
    }}
  />
);
