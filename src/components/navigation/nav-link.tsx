import Link from "next/link";

import { cn } from "@/utils/misc";

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  className?: string;
};

export const NavLink = ({
  href,
  icon: Icon,
  label,
  className,
}: NavLinkProps) => {
  return (
    <Link href={href}>
      <Icon className={cn("transition-colors duration-75", className)} />
      <span className="sr-only">{label}</span>
    </Link>
  );
};
