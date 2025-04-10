import * as fs from "fs";
import * as path from "path";

import { slug } from "github-slugger";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
// ---- Remark Plugins ---- //
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkGfm from "remark-gfm";
// ---- Rehype Plugins ---- //
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import readingTime from "reading-time";

import { type Blog } from "contentlayer/generated";
import { extractTocHeadings } from "@/lib/plugins/extract-headings";
import { getCoreContent } from "@/lib/helpers";

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `<span class="content-header-link">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="link-icon">
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
  </span>`,
  { fragment: true },
);

const isProduction = process.env.NODE_ENV === "production";

/** Count the occurrences of all tags across blog posts & store output in a `.json` file. */
function createTagCount(allBlogs: Blog[]) {
  const tagCount: Record<string, number> = {};

  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || !file.draft)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });

  fs.writeFileSync(
    path.resolve("./src/data/tag-data.json"),
    JSON.stringify(tagCount),
  );

  console.log("✅ Tag count generated!");
}

/**
 * Generate a search index for the blog posts.
 * This index is used to power the *global* search functionality on the site.
 */
const createSearchIndex = (allBlogs: Blog[]) => {
  fs.writeFileSync(
    path.resolve("public/search.json"),
    JSON.stringify(getCoreContent(allBlogs)),
  );
  console.log("✅ Local search index generated!");
};

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
    tags: {
      type: "list",
      of: { type: "string" },
      description: "The tags of the post",
      required: true,
    },
    draft: {
      type: "boolean",
      description: "Is this post a draft?",
      required: true,
    },
    description: {
      type: "string",
      description: "A short excerpt to describe the content of the post",
      required: true,
    },
    image: {
      type: "string",
      description: "The featured image associated with the blog post",
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
    readingTime: {
      type: "json",
      resolve: (doc) => readingTime(doc.body.raw),
    },
    toc: { type: "json", resolve: (doc) => extractTocHeadings(doc.body.raw) },
  },
}));

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "vitesse-dark",
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
          content: icon,
        },
      ],
    ],
  },
  documentTypes: [Blog],
  onSuccess: async (importData) => {
    const { allBlogs } = await importData();
    createTagCount(allBlogs);
    createSearchIndex(allBlogs);
  },
});
