import clsx from "clsx";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface IconProps {
  className?: string;
  [key: string]: unknown;
}

const withIcon = (IconComponent: React.ComponentType<IconProps>) =>
  function ReactIcon({ className, ...props }: IconProps) {
    return (
      <IconComponent className={clsx(className, "fill-white")} {...props} />
    );
  };

export const LinkedIn = withIcon(FaLinkedinIn);
export const X = withIcon(FaXTwitter);
export const GitHub = withIcon(FaGithub);
export const Instagram = withIcon(FaInstagram);
