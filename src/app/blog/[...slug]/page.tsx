import { getMDXComponent } from "next-contentlayer2/hooks";
import { notFound } from "next/navigation";

import "@/css/shiki.css";
import "remark-github-blockquote-alert/alert.css";

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

  // TODO: Author details
  // TODO: Footnotes

  return (
    <PostLayout post={post}>
      <MDXContent components={mdxComponents} />
    </PostLayout>

    // <article className="mx-auto pb-2">
    //   <header className="text-center py-2 pb-0">
    //     <h1 className="text-3xl font-bold">{post.title}</h1>
    //     <time dateTime={post.date} className="text-sm text-neutral-400 ">
    //       {format(parseISO(post.date), "LLLL d, yyyy")}
    //     </time>
    //   </header>
    //   <hr className="mb-2" />

    //   <div className="flex">
    //     {/* <SideBar /> */}
    //     <div className="prose prose-invert">
    //       <MDXContent components={components} />
    //     </div>
    //   </div>
    // </article>
  );
}
