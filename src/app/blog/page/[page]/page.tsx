import { notFound } from "next/navigation";

import { sortedPostsByDateDesc } from "@/data/content";
import { getPaginatedPosts } from "@/lib/helpers";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { PostPreview } from "@/features/blog/components/post-preview";

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await props.params;

  if (sortedPostsByDateDesc.length === 0) {
    return notFound();
  }

  const { paginatedPosts, totalPages } = getPaginatedPosts(
    parseInt(page),
    sortedPostsByDateDesc,
  );

  const paginationProps = {
    totalPages,
    page: parseInt(page),
    to: "/blog",
  };

  return (
    <ListLayoutTags mobileTitle="All Posts" paginationProps={paginationProps}>
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
