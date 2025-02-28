import { type MDXComponents } from "mdx/types";

import { MarkdownImage } from "./markdown-image";
import { CustomLink } from "./link";

export const components: MDXComponents = {
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="text-sm font-mono relative border-green-600/80"
      {...props}
    />
  ),
  /** Static markdown images in `/public` */
  // Image: ({ src, ...rest }: ImageProps) => (
  //   <Image src={`${basePath || ""}${src}`} {...rest} />
  // ),
  img: MarkdownImage,
  a: CustomLink,
};
