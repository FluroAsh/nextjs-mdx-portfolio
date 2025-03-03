"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { slug } from "github-slugger";
import { motion as m } from "motion/react";
import { LucideCalendar, LucideHash } from "lucide-react";

import { paths } from "@/config/paths";
import { PublicationDate } from "./reading-time";
import { cn } from "@/utils/misc";

const Description = ({
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

const Tag = ({ tag }: { tag: string }) => (
  <li>
    <Link
      href={paths.tag.getPathname(slug(tag))}
      className={cn(
        "z-10 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm text-neutral-300 bg-neutral-800/50 hover:bg-green-900/30",
        "hover:text-green-400 transition-colors duration-200",
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

export const PostPreview = ({
  title,
  slug,
  date,
  description,
  tags,
}: PostPreviewProps) => {
  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a tag or any other link
    if (!(e.target as HTMLElement).closest("a")) {
      router.push(paths.post.getPathname(slug));
    }
  };

  return (
    <m.article
      className="w-full border-b border-neutral-800/50 p-4 group relative cursor-pointer"
      variants={item}
      onClick={handleContainerClick}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 mb-4 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-full" />

      <div className="p-2 pl-0 sm:pl-4 group-hover:pl-2 sm:group-hover:pl-6 transition-all duration-200">
        <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-1">
          <LucideCalendar className="size-3.5" />
          <PublicationDate date={date} />
        </div>

        <Heading title={title} />
        <Description text={description} characterLimit={180} />

        <Tags
          items={tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        />
      </div>

      <Link href={paths.post.getPathname(slug)}>
        <span className="sr-only" aria-hidden="true">
          {title}
        </span>
      </Link>
    </m.article>
  );
};
