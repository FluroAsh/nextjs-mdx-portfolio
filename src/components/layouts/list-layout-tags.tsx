import { cn } from "@/lib/utils";
import { TagsSidebar } from "@/components/tags-sidebar";

type ListLayoutTagsProps = { children: React.ReactNode };

export const ListLayoutTags = ({ children }: ListLayoutTagsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 mx-auto px-6 py-8 gap-8 max-w-screen-lg",
        "sm:grid-cols-[240px_minmax(0,auto)]",
      )}
    >
      <TagsSidebar />
      <div className="flex flex-col gap-4">{children}</div>
      {/* TODO: Pagination */}
    </div>
  );
};
