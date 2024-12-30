import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";

import { allBlogs } from "contentlayer/generated";
import { components as mdxComponents } from "@/components/mdx-components";
import PostLayout from "@/layouts/post-layout";

type PostPageProps = {
  params: {
    slug: string[];
  };
};

export async function generateStaticParams() {
  return allBlogs.map((p) => ({
    slug: p.slug.split("/").map((name) => decodeURI(name)),
  }));
}

export default async function Post(props: PostPageProps) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const post = allBlogs.find((post) => post.slug === slug);

  if (!post) {
    return notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <PostLayout post={post}>
      <MDXContent components={mdxComponents} />
      {/* TODO: Footnotes */}
    </PostLayout>
  );
}
