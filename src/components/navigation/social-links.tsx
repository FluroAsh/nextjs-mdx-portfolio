import { author } from "@/data/author";
import { cn } from "@/utils/misc";

import { NavLink } from "./nav-link";

export const SocialLinks = ({
  toggleNeutral = false,
  className,
}: {
  /** Switches default color for fill/stroke to neutral, instead of white. */
  toggleNeutral?: boolean;
  className?: string;
}) => {
  const colors = {
    fill: toggleNeutral ? "fill-neutral-400" : "fill-white",
    stroke: toggleNeutral ? "stroke-neutral-400" : "stroke-white",
  };

  return author.socials.map(({ network, href, Icon: SocialIcon }) => (
    <li key={network}>
      <NavLink
        href={href}
        label={network}
        icon={SocialIcon}
        target="_blank"
        className={cn(
          "size-5",
          network === "X"
            ? `${colors.fill} hover:fill-green-500`
            : `${colors.stroke} hover:stroke-green-500`,
          className,
        )}
      />
    </li>
  ));
};
