/**
 * TODO:
 * 1. Add a "table of contents" to the blog layout that lists all the headings in the post (only shown on >= 800px)
 * 2. Add a "scroll spy" to the blog layout that highlights the current section in the table of contents
 * 3. Add a progress bar to the blog layout that shows how far the user has scrolled through the post
 *    - Should be animated for a smooth transition
 */
import "@/css/shiki.css";
import "remark-github-blockquote-alert/alert.css";

import { type Blog } from "contentlayer/generated";
import SideBar from "@/components/side-bar";
import ArticleDateTime from "@/components/reading-time";

export default function PostLayout({
  post,
  children,
}: {
  post: Blog;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mx-auto px-6">
        <header className="text-center pt-4 mx-auto">
          <h1 className="text-3xl ">{post.title}</h1>
          <ArticleDateTime date={post.date} stats={post.readingTime} />
          <hr className="my-2" />
        </header>

        <div className="flex">
          <SideBar />
          <article className="prose prose-invert pt-2">{children}</article>
        </div>
      </div>
    </div>
  );
}
