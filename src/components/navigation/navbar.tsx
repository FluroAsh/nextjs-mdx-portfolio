import { motion, useScroll } from "motion/react";
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
import { useEffect, useState } from "react";

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
      className="hover:text-green-600 transition-colors duration-300 hover:cursor-pointer"
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

export const FloatingNav = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSearchClick = () => {
    // Implement search
    console.log("search clicked");
  };

  const { scrollY } = useScroll();

  useEffect(() => {
    scrollY.on("change", (current) => {
      if (current > lastScrollY + 50) {
        setVisible(false);
      } else if (current < lastScrollY - 50) {
        setVisible(true);
      }
      setLastScrollY(current);
    });

    return () => scrollY.clearListeners();
  }, [scrollY, lastScrollY]);

  return (
    <motion.nav
      className="fixed top-4 left-1/2 z-10"
      style={{ x: "-50%" }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <ul
        aria-label="navigation links"
        className="flex items-center gap-4 py-3 px-4 sm:py-3 sm:px-8 bg-black/50 rounded-full backdrop-blur-sm border border-neutral-700"
      >
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
    </motion.nav>
  );
};
