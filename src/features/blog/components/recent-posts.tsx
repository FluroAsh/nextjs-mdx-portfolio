import Link from "next/link";
import Image from "next/image";
import { LucideTags } from "lucide-react";
import { allBlogs, type Blog } from "contentlayer/generated";

import { paths } from "@/config/paths";
import { filterByDraft, sortByDate } from "../utils";
import { formatDate } from "@/utils/dates";

const postStyle = (idx: number) => [
  "col-span-1",
  "col-span-1",
  `col-span-1 ${idx === 2 ? "md:col-span-2 lg:col-span-1" : ""}`,
];

const Recentpost = ({
  idx,
  post,
  postCount,
}: {
  idx: number;
  post: Blog;
  postCount: number;
}) => {
  return (
    <Link
      className={`flex ${postStyle(idx)[postCount]} group`}
      href={paths.post.getPathname(post.slug)}
    >
      <div className="relative w-full p-4 border border-input  rounded-md overflow-hidden">
        <div className="flex items-center gap-4 mb-2">
          <Image
            className="size-14 rounded-full border border-neutral-600"
            src="/static/images/ash-avatar.png"
            alt="Picture of the author"
            width={56}
            height={56}
          />

          <div>
            <p className="text-neutral-300 text-xs">{formatDate(post.date)}</p>
            <h2 className="text-lg text-balance">{post.title}</h2>
          </div>

          <Image
            className="z-[-1] absolute inset-0 size-full object-cover shadow-lg brightness-[30%] group-hover:brightness-50 transition duration-300"
            src={post.image as string}
            alt={post.title}
            width={400}
            height={300}
          />
        </div>

        <div className="mb-2">
          <LucideTags size={16} className="inline mr-2" />
          {post.tags.map((tag) => (
            <span key={tag} className="mr-2 text-sm text-neutral-100 font-bold">
              {tag}
            </span>
          ))}
        </div>

        <p className="">{post.description}</p>
      </div>
    </Link>
  );
};

const containerStyles = [
  "auto-rows-max grid-cols-1",
  "auto-rows-max grid-rows-2 md:grid-rows-1 grid-cols-1",
  "auto-rows-max grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
      <h3 className="text-2xl font-bold mb-6 text-center">
        <span className="relative">
          Fresh Off the Press!
          <span className="absolute -left-3 -top-2 w-4 h-4 border-t-2 border-l-2 border-green-700"></span>
          <span className="absolute -right-3 -bottom-2 w-4 h-4 border-r-2 border-b-2 border-green-700"></span>
        </span>
      </h3>

      <div className={`grid gap-4 ${containerStyles[recentPosts.length - 1]}`}>
        {recentPosts.map((post, idx) => (
          <Recentpost
            key={post._id}
            idx={idx}
            post={post}
            postCount={recentPosts.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
