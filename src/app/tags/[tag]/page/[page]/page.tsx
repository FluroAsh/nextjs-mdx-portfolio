import { slug } from "github-slugger";

import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { Pagination } from "@/components/pagination";

import { allBlogs } from "contentlayer/generated";
import { POSTS_PER_PAGE } from "@/config/site";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";

export default async function Page(props: {
  params: { page: string; tag: string };
}) {
  const { page, tag } = await props.params;

  const filteredPosts = allBlogs.filter(
    (post) => !post.draft && post.tags.map((t) => slug(t)).includes(tag),
  );

  const start = (parseInt(page) - 1) * POSTS_PER_PAGE;
  const end = parseInt(page) * POSTS_PER_PAGE;

  const paginatedPosts = filteredPosts.slice(start, end);

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
      <Pagination
        totalPages={totalPages}
        page={parseInt(page)}
        to={`/tags/${tag}`}
      />
    </ListLayoutTags>
  );
}
