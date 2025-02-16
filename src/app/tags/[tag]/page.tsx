import { allBlogs } from "contentlayer/generated";
import { slug } from "github-slugger";

import tagData from "@/data/tag-data.json";
import { MotionPostsContainer, PostPreview } from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";

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

  return (
    <ListLayoutTags>
      <MotionPostsContainer>
        {filteredPosts.map((post) => (
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
