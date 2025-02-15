import { author } from "@/data/author";
import { NavLink } from "./nav-link";
import { cn } from "@/utils/misc";

export const SocialLinks = ({
  toggleNeutral = false,
}: {
  /** Switches default color for fill/stroke to neutral, instead of white. */
  toggleNeutral?: boolean;
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
        className={cn(
          network === "X"
            ? `${colors.fill} hover:fill-green-500`
            : `${colors.stroke} hover:stroke-green-500`,
          "size-5",
        )}
      />
    </li>
  ));
};
