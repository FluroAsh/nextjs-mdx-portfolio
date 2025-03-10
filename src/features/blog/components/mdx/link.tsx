import Link from "next/link";

import { cn } from "@/utils/misc";

const className =
  "text-green-500 hover:text-green-600 transition-colors no-underline transition-75";

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
    <Link
      href={href}
      className={cn("relative", className)}
      target="_blank"
      {...props}
    >
      {children}
    </Link>
  );
};
