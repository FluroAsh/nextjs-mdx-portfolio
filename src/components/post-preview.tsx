"use client";

import Link from "next/link";
import { slug } from "github-slugger";
import { motion as m } from "motion/react";

import { PublicationDate } from "./reading-time";

export const Description = ({
  text,
  characterLimit,
}: {
  text: string;
  characterLimit: number;
}) => {
  return (
    <p className="prose prose-invert">
      {text.length > characterLimit
        ? `${text.slice(0, characterLimit)}...`
        : text}
    </p>
  );
};

export const Tag = ({ tag }: { tag: string }) => (
  <li className="inline-block text-green-500 hover:text-green-300">
    <Link href={`/tags/${slug(tag)}`}>{tag}</Link>
  </li>
);

export const Tags = ({ items }: { items: React.ReactNode }) => (
  <ul className="flex gap-2 whitespace-nowrap flex-wrap gap-y-0 pb-2">
    {items}
  </ul>
);

export const Title = ({ title, slug }: { title: string; slug: string }) => (
  <Link
    href={`/blog/${slug}`}
    className="inline-block pb-1 leading-8 hover:text-green-500  text-2xl tracking-tight transition-colors duration-75"
  >
    <h2>{title}</h2>
  </Link>
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
  return (
    <m.div className="w-full" variants={item}>
      <PublicationDate date={date} className="inline-block text-md pb-1" />

      <div className="overflow-hidden">
        <Title title={title} slug={slug} />

        <Tags
          items={tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        />

        <Description text={description} characterLimit={280} />
      </div>
    </m.div>
  );
};
