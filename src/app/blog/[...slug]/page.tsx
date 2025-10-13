import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer2/hooks";

import PostLayout from "@/components/layouts/post-layout";
import { allBlogContent, sortedPostsByDateAsc } from "@/data/content";
import { components as mdxComponents } from "@/features/blog/components/mdx";
import { PostProvider } from "@/lib/contexts/post-context";

// On-demand ISR: Only revalidate when explicitly triggered
export const revalidate = false;

export function generateStaticParams() {
  return allBlogContent.map((p) => ({ slug: p.slug.split("/") }));
}

export default async function Post(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const postIndex = sortedPostsByDateAsc.findIndex(
    // join params to match against series posts (with slashes)
    (post) => post.slug === params.slug.join("/"),
  );

  const post = sortedPostsByDateAsc[postIndex];

  if (!post) {
    return notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <PostProvider
      post={post}
      next={sortedPostsByDateAsc[postIndex + 1]}
      prev={sortedPostsByDateAsc[postIndex - 1]}
    >
      <PostLayout>
        <MDXContent components={mdxComponents} />
      </PostLayout>
    </PostProvider>
  );
}
