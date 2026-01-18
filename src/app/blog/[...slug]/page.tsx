import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer2/hooks";

import PostLayout from "@/components/layouts/post-layout";
import { allBlogContent, sortedPostsByDateAsc } from "@/data/content";
import { siteMetaData } from "@/data/site-metadata";
import { components as mdxComponents } from "@/features/blog/components/mdx";
import { PostProvider } from "@/lib/contexts/post-context";

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

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const post = allBlogContent.find((p) => p.slug === params.slug.join("/"));

  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.date).toISOString(); // You could add a lastmod field if you want
  const authors = ["Ashley Thompson"];
  const ogImages = post.image ? [post.image] : [siteMetaData.socialBanner];

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: siteMetaData.title,
      locale: "en_AU",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      authors: authors,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ogImages,
    },
  };
}

export function generateStaticParams() {
  return allBlogContent.map((p) => ({ slug: p.slug.split("/") }));
}
