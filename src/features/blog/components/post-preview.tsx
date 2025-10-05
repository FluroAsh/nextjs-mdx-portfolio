"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { type BlogContent } from "contentlayer/utils";
import { slug } from "github-slugger";
import { LucideHash } from "lucide-react";
import { motion as m } from "motion/react";

import { paths } from "@/config/paths";
import { cn } from "@/utils/misc";

import { PublicationDate } from "./reading-time";
import { SeriesBadge } from "./series-badge";

const Description = ({
  text,
  characterLimit,
}: {
  text: string;
  characterLimit: number;
}) => {
  return (
    <p className="line-clamp-3 text-neutral-300">
      {text.length > characterLimit
        ? `${text.slice(0, characterLimit)}...`
        : text}
    </p>
  );
};

const Tag = ({ tag }: { tag: string }) => (
  <li>
    <Link
      href={paths.tag.getPathname(slug(tag))}
      className={cn(
        "z-10 flex items-center justify-center gap-1 rounded-md bg-neutral-800/50 px-2 py-1 text-sm text-neutral-300 hover:bg-green-900/30",
        "transition-colors duration-200 hover:text-green-400",
      )}
    >
      <LucideHash className="size-3 [&_path]:fill-neutral-800" />
      <span className="mt-0.5">{tag}</span>
    </Link>
  </li>
);

const Tags = ({ items }: { items: React.ReactNode }) => (
  <ul className="z-10 flex flex-wrap gap-2 py-3">{items}</ul>
);

const Heading = ({ title }: { title: string }) => (
  <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">{title}</h3>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      staggerChildren: 0.08,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
};

const item = {
  hidden: { y: -10, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export const MotionPostsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <m.div
    className="flex h-full flex-col justify-between"
    variants={container}
    initial="hidden"
    animate="show"
  >
    <div className="flex flex-col gap-4">{children}</div>
  </m.div>
);

export const PostPreview = ({ post }: { post: BlogContent }) => {
  const articleRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a tag or any other link
    if (!(e.target as HTMLElement).closest("a")) {
      router.push(post.url);
    }
  };

  return (
    <m.article
      ref={articleRef}
      className="group relative w-full cursor-pointer border-b border-neutral-800/50 p-4"
      variants={item}
      onClick={handleContainerClick}
    >
      <div className="absolute top-0 bottom-0 left-0 mb-4 w-1 rounded-l-full bg-green-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="p-2 pl-0 transition-all duration-200 group-hover:pl-2 sm:pl-4 sm:group-hover:pl-6">
        <div className="flex w-full items-center justify-between gap-2 pb-2 text-sm text-neutral-400">
          <PublicationDate date={post.date} />
          {post.type === "BlogSeries" && (
            <SeriesBadge
              seriesTitle={post.seriesTitle}
              seriesOrder={post.seriesOrder}
              className="max-w-full overflow-hidden"
            />
          )}
        </div>

        <Heading title={post.title} />
        <Description text={post.description} characterLimit={180} />

        <Tags
          items={post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        />
      </div>

      <Link href={post.url}>
        <span className="sr-only">{post.title}</span>
      </Link>
    </m.article>
  );
};
