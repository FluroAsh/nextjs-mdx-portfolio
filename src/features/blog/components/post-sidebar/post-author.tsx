import Image from "next/image";

import { Link } from "@/components/link";
import { author } from "@/data/author";
import { cn } from "@/utils/misc";

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
        "group flex text-xs *:transition-colors",
        displayVertical && "max-w-[155px] gap-x-1",
      )}
    >
      <Icon
        className={cn(
          "size-4",
          network === "X"
            ? "group-hover:fill-green-500"
            : "group-hover:text-green-500",
        )}
      />
      {displayVertical && (
        <span className="truncate tracking-wide group-hover:text-green-400">
          {handle}
        </span>
      )}
    </Link>
  ));
};

export const PostAuthor = () => {
  return (
    <div className="flex pb-2">
      <Image
        className="mr-2 aspect-square size-16 self-center rounded-full shadow-md shadow-neutral-200/30 drop-shadow-sm"
        src="/static/images/ash-avatar.png"
        width={84}
        height={84}
        alt="Ashley Thompson Avatar"
      />
      <div className="flex flex-col justify-center leading-6">
        <p className="font-bold">{author.name}</p>

        <div
          className={cn(
            "flex w-full gap-y-[4px]",
            displayHorizontal ? "gap-x-1.5" : "flex-col",
          )}
        >
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};
