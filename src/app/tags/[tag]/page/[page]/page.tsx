import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { filterByTag } from "@/utils/blog";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { PostPreview } from "@/components/ui/post-preview";

export default async function Page(props: {
  params: { page: string; tag: string };
}) {
  const { page, tag } = await props.params;

  const filteredPosts = allBlogs.filter((post) => filterByTag(post, tag));
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
