import { notFound } from "next/navigation";

import { getPaginatedPosts } from "@/lib/helpers";
import { sortedPostsByDateDesc } from "@/data/content";
import { PostPreview } from "@/features/blog/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";

export default function Page() {
  if (sortedPostsByDateDesc.length === 0) {
    return notFound();
  }

  const { paginatedPosts, totalPages } = getPaginatedPosts(
    1,
    sortedPostsByDateDesc,
  );

  const paginationProps = {
    totalPages,
    page: 1,
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
