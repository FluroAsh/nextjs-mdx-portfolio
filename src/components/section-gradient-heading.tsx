import { cn } from "@/utils/misc";

type Props = {
  title: string;
  className?: string;
};

export const SectionGradientHeading = ({ title, className }: Props) => (
  <h3
    className={cn("flex items-center gap-4 text-2xl font-bold mb-6", className)}
  >
    <div className="flex-grow max-w-[45px]">
      <span className="h-0.5 w-full block bg-gradient-to-r to-green-500/70 via-green-500/30 from-transparent rounded-full" />
    </div>

    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-600">
      {title}
    </span>

    <div className="flex-grow">
      <span className="h-0.5 w-full block bg-gradient-to-r from-green-500/70 via-green-500/30 to-transparent rounded-full" />
    </div>
  </h3>
);
