import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";

import { allBlogs } from "contentlayer/generated";
import { components as mdxComponents } from "@/components/mdx/mdx-components";
import PostLayout from "@/layouts/post-layout";
import { PostProvider } from "@/lib/providers/post-provider";

type PostPageProps = {
  params: { slug: string[] };
};

export async function generateStaticParams() {
  return allBlogs.map((p) => ({
    slug: p.slug.split("/").map((name) => decodeURI(name)),
  }));
}

export default async function Post(props: PostPageProps) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const postIndex = allBlogs.findIndex((post) => post.slug === slug);
  const post = allBlogs[postIndex];

  if (!post) {
    return notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <PostProvider
      post={post}
      next={allBlogs[postIndex + 1]}
      prev={allBlogs[postIndex - 1]}
    >
      <PostLayout>
        <MDXContent components={mdxComponents} />
        {/* TODO: Footnotes */}
      </PostLayout>
    </PostProvider>
  );
}
