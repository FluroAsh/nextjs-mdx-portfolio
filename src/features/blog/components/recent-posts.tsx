import Link from "next/link";
import Image from "next/image";
import { LucideTags } from "lucide-react";
import { allBlogs, type Blog } from "contentlayer/generated";

import { paths } from "@/config/paths";
import { filterByDraft, sortByDate } from "../utils";
import { formatDate } from "@/utils/dates";
import { SectionGradientHeading } from "@/components/section-gradient-heading";
import { cn } from "@/utils/misc";

const Recentpost = ({ idx, post }: { idx: number; post: Blog }) => {
  return (
    <Link
      className={cn("group flex", idx === 2 && "md:col-span-2 lg:col-span-1")}
      href={paths.post.getPathname(post.slug)}
    >
      <div className="border-input relative isolate w-full overflow-hidden rounded-md border p-4 transition-colors hover:border-green-500">
        <div className="mb-2 flex items-center gap-4">
          <Image
            className="size-14 rounded-full border border-neutral-600"
            src="/static/images/ash-avatar.png"
            alt="Picture of the author"
            width={56}
            height={56}
          />

          <div>
            <p className="text-xs text-neutral-300">{formatDate(post.date)}</p>
            <h2 className="text-lg text-balance">{post.title}</h2>
          </div>

          <Image
            className="absolute inset-0 -z-[10] size-full object-cover shadow-lg brightness-[30%] transition duration-300 group-hover:brightness-50"
            src={post.image as string}
            alt={post.title}
            width={400}
            height={300}
          />
        </div>

        <div className="mb-2">
          <LucideTags size={16} className="mr-2 inline" />
          {post.tags.map((tag) => (
            <span key={tag} className="mr-2 text-sm font-bold text-neutral-100">
              {tag}
            </span>
          ))}
        </div>

        <p className="opacity-80">{post.description}</p>
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
  const recentPosts = allBlogs
    .filter(filterByDraft)
    .sort(sortByDate)
    .slice(0, 3); // Max 3, but could be less

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
