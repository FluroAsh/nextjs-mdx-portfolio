"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Calendar } from "lucide-react";
import { motion as m } from "motion/react";

import { sortedPostsByDateDesc } from "@/data/content";
import { formatDate } from "@/utils/dates";

export const RecentPosts = () => {
  const recentPosts = sortedPostsByDateDesc.slice(0, 3);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Card */}
      <m.div
        className="overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 via-neutral-900/30 to-black p-6 shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium tracking-wider text-green-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          LATEST
        </div>

        <h2 className="mt-3 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Recent Posts
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Thoughts, insights, and stories from my journey.
        </p>
      </m.div>

      {/* Post Cards */}
      <div className="flex flex-1 flex-col gap-4">
        {recentPosts.map((post, idx) => (
          <m.div
            key={post._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
          >
            <Link
              href={post.url}
              className="group relative block overflow-hidden rounded-xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/40 to-neutral-900/20 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={post.image as string}
                  alt={post.title}
                  fill
                  className="object-cover opacity-20 transition-all duration-500 group-hover:scale-105 group-hover:opacity-30"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-5">
                {/* Date */}
                <div className="mb-3 flex items-center gap-2 text-xs text-neutral-400">
                  <Calendar className="size-3.5" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-base leading-tight font-semibold text-neutral-100 transition-colors group-hover:text-green-400">
                  {post.title}
                </h3>

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-700/50 bg-neutral-800/50 px-2 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm transition-colors group-hover:border-green-500/30 group-hover:bg-green-500/10 group-hover:text-green-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="rounded-md bg-neutral-800/30 px-2 py-0.5 text-[10px] text-neutral-500">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                  {post.description}
                </p>

                {/* Read More Link */}
                <div className="flex items-center gap-1 text-xs font-medium text-green-500 transition-all group-hover:gap-2">
                  <span>Read more</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Hover Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </m.div>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/blog"
        className="group mt-2 flex items-center justify-center gap-2 rounded-xl border border-neutral-800/50 bg-neutral-900/30 px-4 py-3 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-green-500/50 hover:bg-neutral-800/50 hover:text-green-400"
      >
        <span>View all posts</span>
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
};
