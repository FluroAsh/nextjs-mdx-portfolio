import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import { type Pluggable } from "unified";

// Heroicon mini link for autolink headings
export const linkIcon = fromHtmlIsomorphic(
  `<span class="content-header-link">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="link-icon">
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
  </span>`,
  { fragment: true },
);

export const prettyCodeOptions: PrettyCodeOptions = {
  theme: "vitesse-dark",
  grid: false,
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
};

export const remarkPlugins: Pluggable[] = [remarkAlert, remarkGfm];
export const rehypePlugins: Pluggable[] = [
  [rehypePrettyCode, prettyCodeOptions],
  rehypeUnwrapImages,
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "prepend",
      headingProperties: {
        ariaLabel: "Link to self",
        className: ["content-header"],
      },
      content: linkIcon,
    },
  ],
];
