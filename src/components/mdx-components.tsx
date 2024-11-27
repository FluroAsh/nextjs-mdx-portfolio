import type { MDXComponents } from "mdx/types";

export const components: MDXComponents = {
  pre: (props) => (
    <pre className="bg-slate-800 p-4 mt-2 rounded-sm" {...props} />
  ),
};
