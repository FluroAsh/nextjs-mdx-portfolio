"use client";

import "remark-github-blockquote-alert/alert.css";

import "@/css/shiki.css";
import { MobileSeriesNavigation } from "@/features/blog/components/mobile-series";
import { MobileTableOfContents } from "@/features/blog/components/mobile-toc";
import { PostHeader } from "@/features/blog/components/post-header";
import { PostPanel } from "@/features/blog/components/post-panel";
import { usePostContext } from "@/lib/contexts/post-context";
import { cn } from "@/utils/misc";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { post } = usePostContext();

  return (
    <div className="w-full">
      <PostHeader />

      {/* The single-column track is required — the article is `max-w-none`, so an `auto` column sizes to its widest figure and overflows. */}
      <div className="max-w-frame fold:grid-cols-[256px_minmax(0,1fr)] mx-auto grid grid-cols-[minmax(0,1fr)] gap-x-10 px-6 pt-8">
        <PostPanel className="fold:flex sticky top-8 hidden" />

        <article
          className={cn(
            "prose prose-invert prose-base max-w-none",
            "prose-p:max-w-[34rem] prose-headings:max-w-[34rem]",
            "prose-ul:max-w-[34rem] prose-ol:max-w-[34rem] prose-blockquote:max-w-[34rem]",
          )}
        >
          {children}
        </article>
      </div>

      <MobileTableOfContents
        headingContent={post.toc}
        className="fold:hidden"
      />
      <MobileSeriesNavigation className="fold:hidden" />
    </div>
  );
}
