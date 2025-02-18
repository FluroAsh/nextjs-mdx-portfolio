import { allBlogs } from "contentlayer/generated";
import { slug } from "github-slugger";

import tagData from "@/data/tag-data.json";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { Pagination } from "@/components/pagination";
import { POSTS_PER_PAGE } from "@/config/site";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: { params: { tag: string } }) {
  const { tag } = await props.params;

  const filteredPosts = allBlogs.filter(
    (post) => !post.draft && post.tags.map((t) => slug(t)).includes(tag),
  );

  const paginatedPosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return (
    <ListLayoutTags>
      <MotionPostsContainer>
        {paginatedPosts.map((post) => (
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
      <Pagination totalPages={totalPages} page={1} to={`/tags/${tag}`} />
    </ListLayoutTags>
  );
}
