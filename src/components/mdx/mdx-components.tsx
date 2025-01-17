import { type MDXComponents } from "mdx/types";

import { MarkdownImage } from "./markdown-image";

export const components: MDXComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="p-4 text-sm font-mono rounded-md relative bottom-1 border border-green-600/80"
      {...props}
    />
  ),
  /** Static markdown images in `/public` */
  // Image: ({ src, ...rest }: ImageProps) => (
  //   <Image src={`${basePath || ""}${src}`} {...rest} />
  // ),
  img: ({ src, alt, ...props }) => (
    <MarkdownImage src={src} alt={alt} {...props} />
  ),
};
