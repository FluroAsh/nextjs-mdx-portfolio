import { cn } from "@/utils/misc";
import { TagsSidebar } from "@/components/ui/tags-sidebar";
import { Pagination } from "../ui/pagination";

const MobileHeading = ({ text }: { text: string }) => {
  return (
    <h1 className="block sm:hidden text-3xl font-bold text-center">{text}</h1>
  );
};

type ListLayoutTagsProps = {
  heading: string;
  children: React.ReactNode;
  paginationProps: {
    totalPages: number;
    currentPage: number;
    to: string;
  };
};

export const ListLayoutTags = ({
  heading,
  children,
  paginationProps,
}: ListLayoutTagsProps) => {
  const { totalPages, currentPage, to } = paginationProps;

  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[1fr,auto] mx-auto px-8 pb-8 sm:pt-8 max-w-screen-lg gap-x-8 md:gap-x-16 gap-y-8",
        "sm:grid-cols-[240px_minmax(0,auto)]",
      )}
    >
      <TagsSidebar />
      <div className="flex flex-col gap-4">
        <MobileHeading text={heading} />
        {children}
      </div>

      <Pagination totalPages={totalPages} page={currentPage} to={to} />
    </div>
  );
};
