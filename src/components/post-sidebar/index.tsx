import Link from "next/link";
import { slug } from "github-slugger";

import { paths } from "@/config/paths";
import { usePostContext } from "@/lib/contexts/post-context";
import { TableOfContents } from "./table-of-contents";
import { PostAuthor } from "./post-author";

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
    <hr className="my-2" />

    <div className="my-4 px-2">
      <h3 className="font-bold uppercase">{heading}</h3>
      <Link
        className="text-sm text-neutral-400 hover:text-green-500 transition-colors duration-75 font-semibold"
        href={link}
      >
        <p className="truncate">{title}</p>
      </Link>

      <div className="mt-2 w-fit ">
        <Link
          className="hover:text-green-500 text-sm py-2 transition-colors duration-75"
          href="/blog"
        >
          <span>&larr;&nbsp;</span>
          <span className="underline">Back to Blog</span>
        </Link>
      </div>
    </div>
  </>
);

const PostTags = ({ items }: { items: string[] }) => (
  <div className="my-4 px-2">
    <h3 className="font-bold uppercase">Tags</h3>
    <ul className="list-inside flex flex-wrap gap-x-2">
      {items.map((item, idx) => (
        <Link
          key={`tag-${idx}`}
          href={`/tags/${slug(item)}`}
          className="text-green-500 font-semibold text-sm hover:text-green-300 transition-colors duration-75"
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
    <aside className="pr-10 min-w-[250px] max-w-[250px] hidden lg:block">
      <PostAuthor />
      <hr className="my-2" />

      <PostTags items={tags} />

      {hasPrevious && (
        <ArticleNavigation
          heading="Previously"
          title={prev.title}
          link={`${paths.post.getPathname(prev.slug)}`}
        />
      )}

      {showNext && (
        <ArticleNavigation
          heading="Up Next"
          title={next.title}
          link={`${paths.post.getPathname(next.slug)}`}
        />
      )}
      <hr className="my-2" />

      <TableOfContents />
    </aside>
  );
};
