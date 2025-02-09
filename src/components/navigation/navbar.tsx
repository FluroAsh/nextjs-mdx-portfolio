import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";

import { Link } from "@/components/link";
import { author } from "@/data/author";
import { paths } from "@/config/paths";
import { cn } from "@/utils/misc";

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  className?: string;
};

const NavLink = ({ href, icon: Icon, label, className }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className="hover:text-green-600 transition-colors duration-300 "
    >
      <Icon
        className={cn(
          "size-5 sm:size-6 transition-colors duration-75",
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

const SocialLinks = () => {
  return (
    <>
      <div className="flex h-[24px] gap-4 border-l border-green-500" />
      {author.socials.map(({ network, href, Icon: SocialIcon }) => (
        <li key={network}>
          <NavLink
            href={href}
            label={network}
            icon={SocialIcon}
            className="fill-white hover:fill-green-500"
          />
        </li>
      ))}
    </>
  );
};

export const NavBar = () => {
  const handleSearchClick = () => {
    // Implement search
    console.log("search clicked");
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
      <ul className="flex items-center gap-4 py-3 px-4 sm:py-4 sm:px-8 bg-black/50 rounded-full backdrop-blur-sm border border-neutral-800">
        <li>
          <NavLink
            href={paths.home.getPathname()}
            label="Home"
            icon={LucideHome}
            className="hover:stroke-green-500"
          />
        </li>
        <li>
          <NavLink
            href={paths.blog.getPathname()}
            label="Blog"
            icon={LucideBookOpen}
            className="hover:stroke-green-500"
          />
        </li>
        <li>
          <NavLink
            href={paths.gallery.getPathname()}
            label="Gallery"
            icon={LucideCamera}
            className="hover:stroke-green-500"
          />
        </li>
        <li className="flex">
          <button onClick={handleSearchClick}>
            <span className="sr-only">Search</span>
            <LucideSearch className="size-5 sm:size-6 hover:stroke-green-500" />
          </button>
        </li>
        <SocialLinks />
      </ul>
    </nav>
  );
};
