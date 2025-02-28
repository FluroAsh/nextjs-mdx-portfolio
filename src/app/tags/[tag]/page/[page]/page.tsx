import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { filterByTag, sortByDate } from "@/features/blog/utils";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { PostPreview } from "@/features/blog/components/post-preview";

export default async function Page(props: {
  params: Promise<{ page: string; tag: string }>;
}) {
  const { page, tag } = await props.params;

  const filteredPosts = allBlogs
    .filter((post) => filterByTag(post, tag))
    .sort(sortByDate);

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
        <PostPreview
          key={post._id}
          date={post.date}
          title={post.title}
          description={post.description}
          tags={post.tags}
          slug={post.slug}
        />
      ))}
    </ListLayoutTags>
  );
}
