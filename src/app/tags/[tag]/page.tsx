import { notFound } from "next/navigation";

import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { allBlogContent } from "@/data/content";
import tagData from "@/data/tag-data.json";
import { PostPreview } from "@/features/blog/components/post-preview";
import { filterByTag, sortByDateDesc } from "@/features/blog/utils";
import { getPaginatedPosts } from "@/lib/helpers";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params;

  const filteredPosts = allBlogContent
    .filter((post) => filterByTag(post, tag))
    .sort(sortByDateDesc);

  if (filteredPosts.length === 0) {
    return notFound();
  }

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
          date={post.date}
          description={post.description}
          tags={post.tags}
          url={post.url}
        />
      ))}
    </ListLayoutTags>
  );
}
