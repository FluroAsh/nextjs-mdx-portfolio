import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { filterByDraft } from "@/utils/blog";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { Pagination } from "@/components/pagination";

export default async function Page(props: { params: { page: string } }) {
  const { page } = await props.params;

  const filteredPosts = allBlogs.filter(filterByDraft);
  const { paginatedPosts, totalPages } = getPaginatedPosts(
    parseInt(page),
    filteredPosts,
  );

  return (
    <ListLayoutTags>
      <MotionPostsContainer>
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
      </MotionPostsContainer>
      <Pagination totalPages={totalPages} page={parseInt(page)} to="/blog" />
    </ListLayoutTags>
  );
}
