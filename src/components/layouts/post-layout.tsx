"use client";

/**
 * TODO:
 * 1. Add a progress bar to the blog layout that shows how far the user has scrolled through the post
 *    - Should be smoothly animated
 */
import "@/css/shiki.css";
import "remark-github-blockquote-alert/alert.css";

import { PostSidebar } from "@/components/post-sidebar";
import ArticleDateTime from "@/components/reading-time";
import { usePostContext } from "@/lib/contexts/post-context";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { post } = usePostContext();

  return (
    <div className="block: sm:flex sm:flex-col">
      <div className="mx-auto px-8">
        <header className="text-center pt-4">
          <h1 className="text-3xl tracking-tight">{post.title}</h1>
          <ArticleDateTime date={post.date} stats={post.readingTime} />
          <hr className="my-2" />
        </header>

        <div className="block sm:flex">
          <PostSidebar />
          <article className="prose prose-invert pt-2">{children}</article>
        </div>
      </div>
    </div>
  );
}
