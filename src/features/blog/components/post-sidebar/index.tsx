import Link from "next/link";

import { slug } from "github-slugger";
import { LucideChevronLeft } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { paths } from "@/config/paths";
import { usePostContext } from "@/lib/contexts/post-context";

import { PostAuthor } from "./post-author";
import { TableOfContents } from "./table-of-contents";

const ArticleSeparator = () => (
  <Separator
    from="from-neutral-600/10"
    via="via-neutral-600"
    to="to-neutral-600/10"
  />
);

const ArticleNavigation = ({
  heading,
  title,
  link,
}: {
  heading: string;
  title: string;
  link: string;
}) => (
  <>
    <ArticleSeparator />

    <div className="my-4 px-2">
      <h3 className="mb-0.5 text-sm font-bold tracking-wider uppercase">
        {heading}
      </h3>
      <Link
        className="text-sm font-semibold text-neutral-400 transition-colors duration-75 hover:text-green-500"
        href={link}
      >
        <p className="truncate">{title}</p>
      </Link>

      <div className="mt-2 w-fit">
        <Link
          className="py-2 text-sm transition-colors duration-75 hover:text-green-500"
          href={paths.blog}
        >
          <LucideChevronLeft className="mr-[3px] inline-block size-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    </div>
  </>
);

const PostTags = ({ items }: { items: string[] }) => (
  <div className="my-4 px-2">
    <h3 className="mb-0.5 text-sm font-bold tracking-wider uppercase">Tags</h3>
    <ul className="flex list-inside flex-wrap gap-x-2">
      {items.map((item, idx) => (
        <Link
          key={`tag-${idx}`}
          href={paths.tag.getPathname(slug(item))}
          className="text-sm font-semibold text-green-500 transition-colors duration-75 hover:text-green-300"
        >
          <li>{item}</li>
        </Link>
      ))}
    </ul>
  </div>
);

export const PostSidebar = () => {
  const {
    post: { tags },
    prev,
    next,
  } = usePostContext();

  const hasPrevious = !!prev;
  const showNext = !hasPrevious && !!next;

  return (
    <aside className="hidden max-w-[250px] min-w-[250px] pt-2 pr-10 lg:block">
      <PostAuthor />
      <ArticleSeparator />

      <PostTags items={tags} />

      {hasPrevious && (
        <ArticleNavigation
          heading="Previously"
          title={prev.title}
          link={paths.post.getPathname(prev.slug)}
        />
      )}

      {showNext && (
        <ArticleNavigation
          heading="Up Next"
          title={next.title}
          link={paths.post.getPathname(next.slug)}
        />
      )}

      <ArticleSeparator />
      <TableOfContents />
    </aside>
  );
};
