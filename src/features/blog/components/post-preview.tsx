"use client";

import Link from "next/link";
import { slug } from "github-slugger";
import { motion as m } from "motion/react";
import { LucideCalendar, LucideHash } from "lucide-react";

import { paths } from "@/config/paths";
import { PublicationDate } from "./reading-time";
import { cn } from "@/utils/misc";

export const Description = ({
  text,
  characterLimit,
}: {
  text: string;
  characterLimit: number;
}) => {
  return (
    <p className="text-neutral-300 line-clamp-3">
      {text.length > characterLimit
        ? `${text.slice(0, characterLimit)}...`
        : text}
    </p>
  );
};

export const Tag = ({ tag }: { tag: string }) => (
  <li>
    <Link
      href={paths.tag.getPathname(slug(tag))}
      className={cn(
        "flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm text-neutral-300 bg-neutral-800/50 hover:bg-green-900/30",
        "hover:text-green-400 transition-colors duration-200",
      )}
    >
      <LucideHash className="size-3 [&_path]:fill-neutral-800" />
      <span className="mt-0.5">{tag}</span>
    </Link>
  </li>
);

export const Tags = ({ items }: { items: React.ReactNode }) => (
  <ul className="flex flex-wrap gap-2 py-3">{items}</ul>
);

export const Heading = ({ title }: { title: string }) => (
  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{title}</h3>
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
}) => {
  return (
    <m.div
      className="flex flex-col justify-between h-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col gap-4">{children}</div>
    </m.div>
  );
};

type PostPreviewProps = {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
};

// TODO: Find a better way to handle navigation to post, along with tag links
// so we can avoid "In HTML, <a> cannot be a descendant of <a>." error(s)
export const PostPreview = ({
  title,
  slug,
  date,
  description,
  tags,
}: PostPreviewProps) => {
  return (
    <Link href={paths.post.getPathname(slug)}>
      <m.div
        className="w-full border-b border-neutral-800/50 p-4 group relative cursor-pointer"
        variants={item}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 mb-4 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="p-2 pl-4 group-hover:pl-6 transition-all duration-200">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <LucideCalendar className="size-4" />
            <PublicationDate date={date} className="text-sm" />
          </div>

          <Heading title={title} />
          <Description text={description} characterLimit={180} />

          <Tags
            items={tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          />
        </div>
      </m.div>
    </Link>
  );
};
