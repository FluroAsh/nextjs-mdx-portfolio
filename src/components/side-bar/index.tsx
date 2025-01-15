import Link from "next/link";

import { TableOfContents } from "./table-of-contents";
import { PostAuthor } from "./post-author";

const PreviousArticle = ({
  heading,
  article,
  children,
}: {
  heading: string;
  article: string;
  children: React.ReactNode;
}) => (
  <div className="my-4 px-2">
    <h3 className="font-bold uppercase">{heading}</h3>
    <p className="text-sm">{article}</p>
    {children}
  </div>
);

const PostTags = ({ items }: { items: string[] }) => (
  <div className="my-4 px-2">
    <h3 className="font-bold uppercase">Tags</h3>
    <ul className="list-inside flex flex-wrap gap-x-2 gap-y-1 text-green-500 font-semibold">
      {items.map((item, idx) => (
        <li key={`tag-${idx}`} className="text-sm">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const SideBar = () => {
  return (
    <aside className="pr-10 min-w-[250px] max-w-[250px] hidden lg:block">
      <PostAuthor
        name="Ashley Thompson"
        socials={[
          { handle: "ashleygthompson", network: "X" },
          { handle: "ashley-thompson-dev", network: "LinkedIn" },
          { handle: "FluroAsh", network: "GitHub" },
        ]}
      />
      <hr className="my-2" />

      <PostTags
        items={["JavaScript", "CSS", "Design", "TypeScript", "Web Development"]}
      />
      <hr className="my-2" />

      {/* TODO: If none exists, don't render this element */}
      <PreviousArticle heading="Previous Article" article="Name of the Article">
        <div className="mt-2 w-fit ">
          <Link
            className="hover:text-green-500 text-sm py-2 transition-colors"
            href="/blog"
          >
            <span>&larr; </span>
            <span className="underline">Back to Blog</span>
          </Link>
        </div>
      </PreviousArticle>
      <hr className="my-2" />

      <TableOfContents />
    </aside>
  );
};
