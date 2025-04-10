"use client";

/**
 * TODO:
 * 1. Add a progress bar to the blog layout that shows how far the user has scrolled through the post
 *    - Should be smoothly animated
 */

import "@/css/shiki.css";
import "remark-github-blockquote-alert/alert.css";

import { usePostContext } from "@/lib/contexts/post-context";
import { PostSidebar } from "@/features/blog/components/post-sidebar";
import { ArticleDateTime } from "@/features/blog/components/reading-time";
import { Separator } from "../ui/separator";
import { MobileTableOfContents } from "@/features/blog/components/mobile-toc";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { post } = usePostContext();

  return (
    <div className="block: sm:flex sm:flex-col">
      <div className="mx-auto px-8">
        <header className="text-center sm:pt-4">
          <h1 className="text-3xl font-bold text-balance">{post.title}</h1>
          <ArticleDateTime
            date={post.date}
            stats={post.readingTime}
            className="pt-2"
          />
          <Separator
            from="from-neutral-600/10"
            via="via-neutral-600"
            to="to-neutral-600/10"
            className="mt-4"
          />
        </header>

        <MobileTableOfContents
          headingContent={post.toc}
          className="lg:hidden"
        />

        <div className="block sm:flex">
          <PostSidebar />
          <article className="prose prose-invert pt-4">{children}</article>
        </div>
      </div>
    </div>
  );
}
