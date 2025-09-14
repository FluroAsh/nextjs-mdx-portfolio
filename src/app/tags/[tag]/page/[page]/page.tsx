import { notFound } from "next/navigation";

import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { allBlogContent } from "@/data/content";
import { PostPreview } from "@/features/blog/components/post-preview";
import { filterByTag, sortByDateAsc } from "@/features/blog/utils";
import { getPaginatedPosts } from "@/lib/helpers";

export default async function Page(props: {
  params: Promise<{ page: string; tag: string }>;
}) {
  const { page, tag } = await props.params;

  const filteredPosts = allBlogContent
    .filter((post) => filterByTag(post, tag))
    .sort(sortByDateAsc);

  if (filteredPosts.length === 0) {
    return notFound();
  }

  const { paginatedPosts, totalPages } = getPaginatedPosts(
    parseInt(page),
    filteredPosts,
  );

  const paginationProps = {
    totalPages,
    page: parseInt(page),
    to: `/tags/${tag}`,
  };

  return (
    <ListLayoutTags mobileTitle={`#${tag}`} paginationProps={paginationProps}>
      {paginatedPosts.map((post) => (
        <PostPreview key={post._id} post={post} />
      ))}
    </ListLayoutTags>
  );
}
