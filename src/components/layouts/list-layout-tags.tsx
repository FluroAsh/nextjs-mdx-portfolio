import { cn } from "@/utils/misc";
import { TagsSidebar } from "@/components/ui/tags-sidebar";

const MobileHeading = ({ text }: { text: string }) => {
  return (
    <h1 className="block sm:hidden text-3xl font-bold text-center">{text}</h1>
  );
};

type ListLayoutTagsProps = { heading: string; children: React.ReactNode };

export const ListLayoutTags = ({ heading, children }: ListLayoutTagsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 mx-auto px-8 py-8 max-w-screen-lg gap-8 md:gap-16",
        "sm:grid-cols-[240px_minmax(0,auto)]",
      )}
    >
      <TagsSidebar />
      <div className="flex flex-col gap-4">
        <MobileHeading text={heading} />
        {children}
      </div>
    </div>
  );
};
