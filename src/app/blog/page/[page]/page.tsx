import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { filterByDraft, sortByDate } from "@/features/blog/utils";
import { PostPreview } from "@/features/blog/components/post-preview";

export default async function Page(props: { params: { page: string } }) {
  const { page } = await props.params;

  const filteredPosts = allBlogs.filter(filterByDraft).sort(sortByDate);

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
