import Image from "next/image";
import Link from "next/link";

import { type BlogContent } from "contentlayer/utils";
import { LucideTags } from "lucide-react";

import { SectionGradientHeading } from "@/components/section-gradient-heading";
import { paths } from "@/config/paths";
import { sortedPostsByDateDesc } from "@/data/content";
import { formatDate } from "@/utils/dates";
import { cn } from "@/utils/misc";

const Recentpost = ({ idx, post }: { idx: number; post: BlogContent }) => {
  return (
    <Link
      className={cn("group flex", idx === 2 && "md:col-span-2 lg:col-span-1")}
      href={paths.post.getPathname(post.slug)}
    >
      <div className="border-input relative isolate w-full overflow-hidden rounded-md border p-4 ring-2 ring-transparent transition group-hover:ring-green-500">
        <div className="mb-2 flex items-center gap-3">
          <Image
            className="size-14 rounded-full border border-neutral-600 transition-colors"
            src="/static/images/ash-avatar.png"
            alt="Picture of the author"
            width={56}
            height={56}
          />

          <div className="min-w-0">
            <p className="text-xs font-bold text-neutral-300">
              {formatDate(post.date)}
            </p>
            <h2 className="truncate text-lg">{post.title}</h2>
          </div>

          <Image
            className="absolute inset-0 -z-[10] size-full object-cover shadow-lg brightness-[30%] transition duration-300 group-hover:brightness-40"
            src={post.image as string}
            alt={post.title}
            width={400}
            height={300}
          />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <LucideTags
            size={16}
            className="text-neutral-100 transition-colors group-hover:text-green-500"
          />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center rounded-sm border bg-black/50 px-2 py-0.5 text-xs tracking-wide backdrop-blur transition",
                "group-hover:border-green-700/40 group-hover:bg-green-900/20 group-hover:text-green-400",
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-neutral-300">{post.description}</p>
      </div>
    </Link>
  );
};

const containerStyles = [
  "grid-cols-1",
  "grid-rows-2 md:grid-rows-1 grid-cols-1",
  "grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
];

// TODO: Add a cooler hover glow effect all posts
// ie: Brightness mask on hover over cursor/image
export const RecentPosts = () => {
  const recentPosts = sortedPostsByDateDesc.slice(0, 3); // Max 3, but could be less

  return (
    <div className={`${recentPosts.length > 0 ? "" : "hidden"}`}>
      <SectionGradientHeading title="Recent Posts" />

      <div
        className={`grid auto-rows-max gap-4 ${containerStyles[recentPosts.length - 1]}`}
      >
        {recentPosts.map((post, idx) => (
          <Recentpost key={post._id} idx={idx} post={post} />
        ))}
      </div>
    </div>
  );
};
