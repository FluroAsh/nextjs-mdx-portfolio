import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { type Networks, NETWORKS } from "@/data/site-metadata";
import * as SocialIcons from "./social-icons";
import { usePostContext } from "@/lib/providers/post-provider";
import { TocItem } from "@/lib/plugins/extract-headings";

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
  return (
    <div className="flex py-2">
      <Image
        className="size-16 rounded-full mr-2 aspect-square shadow-md drdop-shadow-sm shadow-neutral-200/30 self-center"
        src="/static/images/ash-avatar.png"
        width={84}
        height={84}
        alt="Ashley Thompson Avatar"
      />
      <div className="leading-6 flex flex-col justify-center">
        <p className="font-bold">{name}</p>

        <div
          className={cn(
            "flex gap-y-[2px] w-full",
            socials.length > 3 ? "gap-x-1.5" : "flex-col",
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
                className={cn(
                  "group flex text-xs [&>*]:transition-colors",
                  socials.length < 4 && "gap-x-1 max-w-[155px]",
                )}
              >
                <IconComponent
                  className={"min-w-4 min-h-4 group-hover:fill-green-400"}
                />
                {socials.length < 4 && (
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

const getPaddingClass = (depth: number) => {
  const paddingMap = [undefined, "pl-2", "pl-4", "pl-6", "pl-8", "pl-10"];
  return paddingMap[depth - 2];
};

const generateTOC = (headings: TocItem[]) =>
  headings.map((heading) => (
    <li className={cn(getPaddingClass(heading.depth), "list-none leading-7")}>
      <a href={heading.url}>{heading.value}</a>
    </li>
  ));

// TODO: Add a cool vertical "line" element and transition each when navigating between headings using a scroll spy
const TableOfContents = () => {
  const headings = usePostContext().post.toc;

  return (
    <nav className="sticky top-4 my-4 px-2">
      <h3 className="font-bold mb-2 uppercase">Contents</h3>
      <ul className="list-inside list-decimal tracking-wide">
        {generateTOC(headings)}
      </ul>
    </nav>
  );
};

export default function SideBar() {
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
}
