import { type BlogContent } from "contentlayer/utils";

import { ScanlinePlane } from "@/components/scanline-plane";
import { RecentPosts } from "@/features/blog/components/recent-posts";
import { cn } from "@/utils/misc";

import { TimelineSection } from "./timeline";

/**
 * Work and writing as two columns of one chapter, not two chapters. Posts carry
 * no index of their own, so the chapter spine keeps the same count whether the
 * columns sit side by side or stack.
 */
export const RecordsChapter = ({
  posts,
  className,
}: {
  posts: BlogContent[];
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    <ScanlinePlane />

    <div className="max-w-frame py-section relative z-10 mx-auto w-full px-6">
      {/* 17rem between the fold and `lg` keeps the records column above 500px,
          which is where its prose stops holding a readable line length. */}
      <div className="fold:grid-cols-[minmax(0,1fr)_17rem] grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Divider hangs off the taller column so it never stops partway down. */}
        <TimelineSection className="fold:border-r fold:border-green-500/15 fold:pr-10" />

        <RecentPosts posts={posts} />
      </div>
    </div>
  </div>
);
