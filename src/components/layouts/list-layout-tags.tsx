import { cn } from "@/utils/misc";
import { TagsSidebar } from "@/components/ui/tags-sidebar";
import { Pagination, type PaginationProps } from "../ui/pagination";

const MobileHeading = ({ title }: { title: string }) => {
  return (
    <h1 className="block sm:hidden text-3xl font-bold text-center">{title}</h1>
  );
};

type ListLayoutTagsProps = {
  mobileTitle: string;
  children: React.ReactNode;
  paginationProps: PaginationProps;
};

export const ListLayoutTags = ({
  mobileTitle,
  children,
  paginationProps,
}: ListLayoutTagsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[1fr,auto] mx-auto px-8 pb-8 sm:pt-8 max-w-screen-lg gap-x-8 md:gap-x-16 gap-y-8",
        "sm:grid-cols-[240px_minmax(0,auto)]",
      )}
    >
      <TagsSidebar />
      <div className="flex flex-col gap-4">
        <MobileHeading title={mobileTitle} />
        {children}
      </div>

      <Pagination {...paginationProps} />
    </div>
  );
};
