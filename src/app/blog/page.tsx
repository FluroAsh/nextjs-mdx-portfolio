import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { sortedPostsByDateDesc } from "@/data/content";
import { PostPreview } from "@/features/blog/components/post-preview";
import { getPaginatedPosts } from "@/lib/helpers";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing about web development, photography, and life.",
};

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
        <PostPreview key={post._id} post={post} />
      ))}
    </ListLayoutTags>
  );
}
