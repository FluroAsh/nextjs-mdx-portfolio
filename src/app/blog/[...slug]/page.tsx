import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer2/hooks";

import PostLayout from "@/components/layouts/post-layout";
import { allBlogContent, sortedPostsByDateAsc } from "@/data/content";
import { components as mdxComponents } from "@/features/blog/components/mdx";
import { PostProvider } from "@/lib/contexts/post-context";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return allBlogContent.map((p) => ({
    slug: p.slug.split("/").map((name) => decodeURI(name)),
  }));
}

export default async function Post(props: PostPageProps) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const postIndex = sortedPostsByDateAsc.findIndex(
    (post) => post.slug === slug,
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
