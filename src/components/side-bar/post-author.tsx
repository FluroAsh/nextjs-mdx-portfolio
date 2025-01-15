import Image from "next/image";

import { cn } from "@/lib/utils";
import { type Networks, NETWORKS } from "@/data/site-metadata";
import * as SocialIcons from "../social-icons";

const SocialIconMap = {
  [NETWORKS.X]: SocialIcons.X,
  [NETWORKS.LinkedIn]: SocialIcons.LinkedIn,
  [NETWORKS.GitHub]: SocialIcons.GitHub,
  [NETWORKS.Instagram]: SocialIcons.Instagram,
};

export const PostAuthor = ({
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
