import { slug } from "github-slugger";
import { title } from "radash";

import { cn } from "@/utils/misc";
import { Pagination, type PaginationProps } from "@/components/pagination";
import { TagsSidebar } from "@/features/blog/components/tags-sidebar";
import { MobileSelectNavigation } from "@/features/blog/components/select-tags";
import { MotionPostsContainer } from "@/features/blog/components/post-preview";

import tags from "@/data/tag-data.json";

// TODO: Move this to a utility function
const mobileLinks = [
  {
    title: "All Posts",
    slug: "all-posts",
  },
].concat(
  Object.keys(tags).map((tag) => ({
    title: tag === "mdx" ? tag.toUpperCase() : title(slug(tag)),
    slug: slug(tag),
  })),
);

const MobileHeading = ({ title }: { title: string }) => (
  <h1 className="block sm:hidden text-3xl font-bold text-center">{title}</h1>
);

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
        "grid grid-cols-1 grid-rows-[1fr_auto] mx-auto px-8 pb-8 sm:pt-8 max-w-5xl gap-x-8 lg:gap-x-16 gap-y-8",
        "sm:grid-cols-[200px_minmax(0,auto)]",
      )}
    >
      <TagsSidebar />

      <div className="flex flex-col gap-4">
        <MobileHeading title={mobileTitle} />
        <MobileSelectNavigation items={mobileLinks} />
        <MotionPostsContainer>{children}</MotionPostsContainer>
      </div>

      <Pagination {...paginationProps} />
    </div>
  );
};
