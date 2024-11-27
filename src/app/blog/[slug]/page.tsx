import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";

import { components } from "@/components/mdx-components";
import { allBlogs } from "contentlayer/generated";
import Link from "next/link";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: PostPageProps) {
  const post = allBlogs.find((post) => post.slug === params.slug);

  if (!post) {
    return notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
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
