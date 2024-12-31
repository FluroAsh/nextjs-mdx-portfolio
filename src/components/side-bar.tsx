import Link from "next/link";
import clsx from "clsx";

import { type Networks, NETWORKS } from "@/data/site-metadata";
import * as SocialIcons from "./social-icons";
import Image from "next/image";

const SocialIconMap = {
  [NETWORKS.X]: SocialIcons.X,
  [NETWORKS.LinkedIn]: SocialIcons.LinkedIn,
  [NETWORKS.GitHub]: SocialIcons.GitHub,
  [NETWORKS.Instagram]: SocialIcons.Instagram,
};

const PostAuthor = ({
  name,
  socials,
}: {
  name: string;
  socials: {
    handle: string;
    network: Networks;
  }[];
}) => {
  const hideHandles = socials.length > 2;

  return (
    <div className="flex py-2">
      <Image
        className="size-16 rounded-full mr-2 aspect-square shadow-md drdop-shadow-sm shadow-neutral-200/30"
        src="/static/images/ash-avatar.png"
        width={84}
        height={84}
        alt="Ashley Thompson Avatar"
      />
      <div className="leading-6 flex flex-col justify-center">
        <p className="font-bold">{name}</p>

        <div
          className={clsx(
            "flex gap-y-[2px] w-full",
            hideHandles ? "gap-x-1.5" : "flex-col",
          )}
        >
          {socials.map(({ handle, network }) => {
            const IconComponent = SocialIconMap[network];

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
                <IconComponent className="min-w-4 min-h-4 group-hover:fill-green-400" />
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

// TODO: Implement dynamic Table of Contents
const TableOfContents = () => (
  <nav className="sticky top-4 my-4 px-2">
    <h3 className="font-bold mb-2 uppercase">Contents</h3>
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
}
