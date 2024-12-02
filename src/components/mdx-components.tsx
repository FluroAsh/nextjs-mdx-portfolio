import type { MDXComponents } from "mdx/types";
// import Image from "next/image";

export const components: MDXComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="p-4 not-prose text-sm font-mono rounded-bl-md rounded-br-md"
      {...props}
    />
  ),
  // Image: (props) => <Image {...props} />,
};
