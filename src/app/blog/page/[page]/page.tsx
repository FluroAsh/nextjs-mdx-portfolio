import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { filterByDraft } from "@/utils/blog";
import {
  MotionPostsContainer,
  PostPreview,
} from "@/components/ui/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";

export default async function Page(props: { params: { page: string } }) {
  const { page } = await props.params;

  const filteredPosts = allBlogs.filter(filterByDraft);
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
    </ListLayoutTags>
  );
}
