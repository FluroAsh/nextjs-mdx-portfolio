import { allBlogs } from "contentlayer/generated";

import tagData from "@/data/tag-data.json";
import {
  MotionPostsContainer,
  PostPreview,
} from "@/components/ui/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { filterByTag } from "@/utils/blog";
import { getPaginatedPosts } from "@/lib/helpers";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: { params: { tag: string } }) {
  const { tag } = await props.params;

  const filteredPosts = allBlogs.filter((post) => filterByTag(post, tag));
  const { paginatedPosts, totalPages } = getPaginatedPosts(1, filteredPosts);

  const paginationProps = {
    totalPages,
    currentPage: 1,
    to: `/tags/${tag}`,
  };

  return (
    <ListLayoutTags heading={`#${tag}`} paginationProps={paginationProps}>
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
    </ListLayoutTags>
  );
}
