import { type MDXComponents } from "mdx/types";

import { Video } from "@/components/video";
import { MarkdownImage } from "./markdown-image";
import { CustomLink } from "./link";
import { ImageCollection } from "./collection/lightbox-collection";
import { LightboxImage } from "./lightbox-image";

export const components: MDXComponents = {
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="relative border-green-600/80 font-mono text-sm"
      {...props}
    />
  ),
  img: MarkdownImage,
  LightboxImage: (props) => (
    <LightboxImage src={props.src} alt={props.alt} caption={props.caption}>
      <MarkdownImage {...props} />
    </LightboxImage>
  ),
  /** Static markdown images in `/public` */
  // Image: ({ src, ...rest }: ImageProps) => (
  //   <Image src={`${basePath || ""}${src}`} {...rest} />
  // ),
  a: CustomLink,
  ImageCollection,
  Video,
};
