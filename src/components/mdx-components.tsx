import type { MDXComponents } from "mdx/types";
import { Pre } from "./pre";
// import Image from "next/image";

export const components: MDXComponents = {
  pre: Pre,
  // Image: (props) => <Image {...props} />,
};
