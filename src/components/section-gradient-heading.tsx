import { cn } from "@/utils/misc";

type Props = {
  title: string;
  className?: string;
};

export const SectionGradientHeading = ({ title, className }: Props) => (
  <h3
    className={cn("mb-6 flex items-center gap-4 text-2xl font-bold", className)}
  >
    <div className="flex-grow sm:max-w-16">
      <span className="block h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-green-500/30 to-green-500/70" />
    </div>

    <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
      {title}
    </span>

    <div className="flex-grow">
      <span className="block h-[1px] w-full rounded-full bg-gradient-to-r from-green-500/70 via-green-500/30 to-transparent" />
    </div>
  </h3>
);
