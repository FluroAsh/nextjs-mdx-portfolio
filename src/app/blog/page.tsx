import { allBlogs } from "contentlayer/generated";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { Pagination } from "@/components/pagination";
import { POSTS_PER_PAGE } from "@/config/site";

export default function Page() {
  const filteredPosts = allBlogs.filter((post) => !post.draft);
  const paginatedPosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

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
      <Pagination totalPages={totalPages} page={1} to="/blog" />
    </ListLayoutTags>
  );
}
