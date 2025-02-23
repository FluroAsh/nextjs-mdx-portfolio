import { allBlogs } from "contentlayer/generated";

import { getPaginatedPosts } from "@/lib/helpers";
import { filterByDraft } from "@/utils/blog";
import {
  MotionPostsContainer,
  PostPreview,
} from "@/components/ui/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { Pagination } from "@/components/ui/pagination";

export default function Page() {
  const filteredPosts = allBlogs.filter(filterByDraft);
  const { paginatedPosts, totalPages } = getPaginatedPosts(1, filteredPosts);

  return (
    <ListLayoutTags heading="All Posts">
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
      <Pagination totalPages={totalPages} page={1} to="/blog" />
    </ListLayoutTags>
  );
}
