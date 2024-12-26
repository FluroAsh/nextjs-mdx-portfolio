/**
 * TODO:
 * 1. Add a "table of contents" to the blog layout that lists all the headings in the post (only shown on >= 800px)
 * 2. Add a "scroll spy" to the blog layout that highlights the current section in the table of contents
 * 3. Add a progress bar to the blog layout that shows how far the user has scrolled through the post
 *    - Should be animated for a smooth transition
 */

import { format, parseISO } from "date-fns";
import { type Blog } from "contentlayer/generated";

import SideBar from "@/components/side-bar";

export default function PostLayout({
  post,
  children,
}: {
  post: Blog;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto pb-2">
      <header className="text-center py-2 my-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <time dateTime={post.date} className="text-sm text-neutral-400 ">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
      </header>
      <hr className="mb-2" />

      <div className="flex">
        <SideBar />
        <div className="prose prose-invert">{children}</div>
      </div>
    </article>
  );
}
