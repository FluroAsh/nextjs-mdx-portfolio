import { type MDXComponents } from "mdx/types";

import { MarkdownImage } from "./markdown-image";
import { CustomLink } from "./link";
import { Video } from "@/components/video";

export const components: MDXComponents = {
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="relative border-green-600/80 font-mono text-sm"
      {...props}
    />
  ),
  /** Static markdown images in `/public` */
  // Image: ({ src, ...rest }: ImageProps) => (
  //   <Image src={`${basePath || ""}${src}`} {...rest} />
  // ),
  img: MarkdownImage,
  a: CustomLink,
  Video,
};
