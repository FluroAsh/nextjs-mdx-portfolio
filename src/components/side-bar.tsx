import Link from "next/link";
import clsx from "clsx";

import { type Networks, NETWORKS } from "@/data/site-metadata";
import { GitHub, Instagram, LinkedIn, X } from "./social-icons";

const SocialIcons = (className: string) =>
  ({
    [NETWORKS.X]: <X className={className} />,
    [NETWORKS.LinkedIn]: <LinkedIn className={className} />,
    [NETWORKS.GitHub]: <GitHub className={className} />,
    [NETWORKS.Instagram]: <Instagram className={className} />,
  }) as Record<Networks, React.ReactNode>;

const PostAuthor = ({
  name,
  socials,
}: {
  name: string;
  socials: Array<{
    handle: string;
    network: Networks;
  }>;
}) => {
  const hideHandles = socials.length > 2;

  return (
    <div className="flex py-2">
      <div className="bg-neutral-600 size-12 rounded-full mr-2 aspect-square"></div>
      <div className="leading-6 flex flex-col justify-center">
        <p className="font-bold">{name}</p>

        <div
          className={clsx(
            "flex gap-y-[2px] w-full",
            hideHandles ? "gap-x-1.5" : "flex-col",
          )}
        >
          {socials.map(({ handle, network }) => {
            return (
              <a
                key={network}
                href={`https://www.${network.toLowerCase()}.com/${network === "LinkedIn" ? "in/" : ""}${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "group flex text-xs [&>*]:transition-colors",
                  !hideHandles && "gap-x-1 max-w-[155px]",
                )}
              >
                {
                  SocialIcons("min-w-4 min-h-4 group-hover:fill-green-400")[
                    network
                  ]
                }
                {socials.length <= 2 && (
                  <span className="group-hover:text-green-400 tracking-wide truncate">
                    {handle}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PostTags = ({ items }: { items: string[] }) => {
  return (
    <div className="my-4 px-2">
      <p className="font-bold uppercase">Tags</p>
      <ul className="list-inside flex flex-wrap gap-x-2 gap-y-1 text-green-500">
        {items.map((item, idx) => (
          <li key={`tag-${idx}`} className="text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PreviousArticle = ({
  heading,
  article,
  children,
}: {
  heading: string;
  article: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="my-4 px-2">
      <p className="font-bold uppercase">{heading}</p>
      <p className="text-sm">{article}</p>
      {children}
    </div>
  );
};

const TableOfContents = () => {
  return (
    <nav className="sticky top-4 my-4 px-2">
      <h2 className="text-lg font-bold mb-2 uppercase">Table of Contents</h2>
      <ul className="list-inside list-decimal tracking-wide">
        <li className="mb-2">
          Heading 1
          <ol className="list-inside list-decimal ml-4">
            <li className="mb-1 text-sm">Subheading 1</li>
            <li className="mb-1 text-sm">Subheading 2</li>
          </ol>
        </li>
        <li className="mb-2">Heading 2</li>
        <li className="mb-2">Heading 3</li>
      </ul>
    </nav>
  );
};

export default function SideBar() {
  return (
    <aside className="pr-10 w-[250px] hidden lg:block">
      <PostAuthor
        name="Ashley Thompson"
        socials={[
          { handle: "ashleygthompson", network: "X" },
          { handle: "ashley-thompson-dev", network: "LinkedIn" },
        ]}
      />
      <hr className="my-2" />

      <PostTags items={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]} />
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
}
