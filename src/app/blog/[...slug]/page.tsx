import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";

import PostLayout from "@/components/layouts/post-layout";
import { PostProvider } from "@/lib/contexts/post-context";
import { components as mdxComponents } from "@/features/blog/components/mdx";
import { allBlogContent } from "@/data/content";

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
  const postIndex = allBlogContent.findIndex((post) => post.slug === slug);
  const post = allBlogContent[postIndex];

  if (!post) {
    return notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <PostProvider
      post={post}
      next={allBlogContent[postIndex + 1]}
      prev={allBlogContent[postIndex - 1]}
    >
      <PostLayout>
        <MDXContent components={mdxComponents} />
      </PostLayout>
    </PostProvider>
  );
}
