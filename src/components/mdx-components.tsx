import { type MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

const basePath = process.env.BASE_PATH;

export const components: MDXComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="p-4 not-prose text-sm font-mono rounded-bl-md rounded-br-md"
      {...props}
    />
  ),
  Image: ({ src, ...rest }: ImageProps) => (
    <Image src={`${basePath || ""}${src}`} {...rest} />
  ),
};
