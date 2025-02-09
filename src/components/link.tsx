import NextLink from "next/link";

export const Link = ({
  href,
  children,
  className,
  ...props
}: React.ComponentProps<"a">) => {
  if (!href) throw new Error("href is required for the link component");

  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <NextLink {...props} href={href}>
        {children}
      </NextLink>
    );
  }

  return (
    <NextLink {...props} href={href} className={className} target="_blank">
      {children}
    </NextLink>
  );
};
