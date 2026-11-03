import { type MDXComponents } from "mdx/types";

import { lightboxSlide } from "@/server/image";

import { ImageCollection } from "./collection/lightbox-collection";
import { LightboxImage } from "./lightbox-image";
import { CustomLink } from "./link";
import { ResponsiveImage } from "./responsive-image";
import { Video } from "./video";

export const components: MDXComponents = {
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="relative border-green-600/80 font-mono text-sm"
      {...props}
    />
  ),
  img: ResponsiveImage,
  LightboxImage: async (props) => {
    const slide = props.src ? await lightboxSlide(props.src) : {};
    return (
      <LightboxImage {...slide} alt={props.alt} caption={props.caption}>
        <ResponsiveImage {...props} />
      </LightboxImage>
    );
  },
  /** Static markdown images in `/public` */
  // Image: ({ src, ...rest }: ImageProps) => (
  //   <Image src={`${basePath || ""}${src}`} {...rest} />
  // ),
  a: CustomLink,
  ImageCollection,
  Video,
};
