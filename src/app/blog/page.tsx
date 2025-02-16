import { allBlogs } from "contentlayer/generated";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";

export default function Page() {
  const posts = allBlogs.filter((post) => !post.draft);

  return (
    <ListLayoutTags>
      <MotionPostsContainer>
        {posts.map((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            slug={post.slug}
            date={post.date}
            description={post.description}
            tags={post.tags}
          />
        ))}
      </MotionPostsContainer>
    </ListLayoutTags>
  );
}
