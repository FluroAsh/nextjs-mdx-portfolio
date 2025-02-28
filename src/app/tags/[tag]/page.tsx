import { allBlogs } from "contentlayer/generated";

import tagData from "@/data/tag-data.json";
import { PostPreview } from "@/features/blog/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { filterByTag, sortByDate } from "@/features/blog/utils";
import { getPaginatedPosts } from "@/lib/helpers";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: { params: { tag: string } }) {
  const { tag } = await props.params;

  const filteredPosts = allBlogs
    .filter((post) => filterByTag(post, tag))
    .sort(sortByDate);

  const { paginatedPosts, totalPages } = getPaginatedPosts(1, filteredPosts);

  const paginationProps = {
    totalPages,
    page: 1,
    to: `/tags/${tag}`,
  };

  return (
    <ListLayoutTags mobileTitle={`#${tag}`} paginationProps={paginationProps}>
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
    </ListLayoutTags>
  );
}
