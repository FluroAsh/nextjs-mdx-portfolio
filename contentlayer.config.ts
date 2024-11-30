import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) =>
        `/blog/${doc._raw.sourceFileName.replace(/\.mdx$/, "")}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => `${doc._raw.sourceFileName.replace(/\.mdx$/, "")}`,
    },
  },
}));

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "slack-dark",
  grid: false,
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
};

export default makeSource({
  contentDirPath: "blog",
  mdx: {
    remarkPlugins: [remarkAlert, remarkGfm],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          headingProperties: {
            className: ["content-header"],
          },
          content: "tag",
        },
      ],
    ],
  },
  documentTypes: [Blog],
});
