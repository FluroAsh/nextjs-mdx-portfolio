import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";
import Link from "next/link";

import "@/css/shiki.css";
import "remark-github-blockquote-alert/alert.css";

import { format, parseISO } from "date-fns";

import { allBlogs } from "contentlayer/generated";
import { components } from "@/components/mdx-components";

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
    <article className="prose prose-neutral prose-invert py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-sm text-neutral-400 ">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl">{post.title}</h1>
      </div>

      <MDXContent components={components} />

      <div className="pt-2">
        <Link className="underline text-sky-500" href="/blog">
          Back to Blog
        </Link>
      </div>
    </article>
  );
}
