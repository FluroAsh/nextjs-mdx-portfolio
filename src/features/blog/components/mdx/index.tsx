import { type MDXComponents } from "mdx/types";

import { ImageCollection } from "./collection/lightbox-collection";
import { LightboxImage } from "./lightbox-image";
import { CustomLink } from "./link";
import { MarkdownImage } from "./markdown-image";
import { Video } from "./video";

export const components: MDXComponents = {
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="relative border-green-600/80 font-mono text-sm"
      {...props}
    />
  ),
  img: MarkdownImage,
  // TODO: This could just be one component
  // serverImage can be a child inside LightboxImage (as it will use MarkdownImage by default anyway)
  // Then we can just have Lightbox exist along-side it, and have the whole component be (client component + server child)!
  LightboxImage: (props) => (
    <LightboxImage src={props.src} alt={props.alt} caption={props.caption}>
      <MarkdownImage {...props} isLightboxImage />
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
