import { cn } from "@/utils/misc";
import { TagsSidebar } from "@/components/ui/tags-sidebar";
import { Pagination, type PaginationProps } from "../ui/pagination";
import { MotionPostsContainer } from "../ui/post-preview";
import { MobileSelectNavigation } from "../ui/select-tags";

import { slug } from "github-slugger";
import { title } from "radash";
import tags from "@/data/tag-data.json";

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
        "grid grid-cols-1 grid-rows-[1fr_auto] mx-auto px-8 pb-8 sm:pt-8 max-w-5xl gap-x-8 md:gap-x-16 gap-y-8",
        "sm:grid-cols-[240px_minmax(0,auto)]",
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
