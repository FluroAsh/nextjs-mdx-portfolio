import { Pagination, type PaginationProps } from "@/components/pagination";
import {
  ExplorerColumn,
  type ExplorerCounts,
  ExplorerSelect,
} from "@/features/blog/components/content-explorer";
import { PostList } from "@/features/blog/components/post-list";
import { cn } from "@/utils/misc";

type ListLayoutTagsProps = ExplorerCounts & {
  mobileTitle: string;
  children: React.ReactNode;
  paginationProps: PaginationProps;
};

export const ListLayoutTags = ({
  mobileTitle,
  children,
  paginationProps,
  resultCount,
  totalPosts,
}: ListLayoutTagsProps) => (
  <div
    className={cn(
      "max-w-frame mx-auto grid w-full grid-cols-1 grid-rows-[1fr_auto]",
      "gap-x-8 gap-y-8 px-6 pb-8 sm:pt-8 lg:gap-x-16",
      "md:grid-cols-[200px_minmax(0,auto)]", // Not `sm:` — at 640px the post column drops to ~38 characters.
    )}
  >
    <ExplorerColumn resultCount={resultCount} totalPosts={totalPosts} />

    <div className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold md:hidden">
        {mobileTitle}
      </h1>

      <ExplorerSelect resultCount={resultCount} totalPosts={totalPosts} />

      <PostList>{children}</PostList>
    </div>

    <Pagination {...paginationProps} />
  </div>
);
