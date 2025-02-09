import Image from "next/image";

import { cn } from "@/utils/misc";
import { author } from "@/data/author";
import { Link } from "@/components/link";

const filteredSocials = author.socials.filter(
  ({ network }) => network !== "Instagram",
);

const displayVertical = filteredSocials.length < 4;
const displayHorizontal = filteredSocials.length > 3;

const SocialLinks = () => {
  return filteredSocials.map(({ handle, network, href, Icon }) => (
    <Link
      key={network}
      href={href}
      className={cn(
        "group flex text-xs [&>*]:transition-colors",
        displayVertical && "gap-x-1 max-w-[155px]",
      )}
    >
      <Icon className="min-w-4 min-h-4 size-4 group-hover:fill-green-400" />
      {displayVertical && (
        <span className="group-hover:text-green-400 tracking-wide truncate">
          {handle}
        </span>
      )}
    </Link>
  ));
};

export const PostAuthor = () => {
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
        <p className="font-bold">{author.name}</p>

        <div
          className={cn(
            "flex gap-y-[2px] w-full",
            displayHorizontal ? "gap-x-1.5" : "flex-col",
          )}
        >
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};
