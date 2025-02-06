import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

const className = cn("text-green-500 hover:text-green-300 transition-colors");

export const CustomLink = ({
  href,
  children,
  ...props
}: React.ComponentProps<"a">) => {
  if (!href) throw new Error("href is required for CustomLink");

  const isInternalLink = href.startsWith("/");
  const isAnchorLink = href.startsWith("#");

  if (isInternalLink) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  if (isAnchorLink) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cn("relative ", className)}
      target="_blank"
      {...props}
    >
      {children}
      <ExternalLink className="inline-block ml-[3px] mb-[12px]" size={12} />
    </a>
  );
};
