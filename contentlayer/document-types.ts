import {
  ComputedFields,
  FieldDefs,
  defineDocumentType,
} from "contentlayer2/source-files";
import readingTime from "reading-time";

import { extractTocHeadings } from "@/lib/plugins/extract-headings";

// ---- Shared Field Definitions ---- //
export const sharedPostFields: FieldDefs = {
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
};

/**
 * Fields that are computed based on other values.
 * These are added to all document types that represent a blog post.
 */
export const sharedPostComputedFields: ComputedFields = {
  readingTime: {
    type: "json",
    resolve: (doc) => readingTime(doc.body.raw),
  },
  toc: {
    type: "json",
    resolve: (doc) => extractTocHeadings(doc.body.raw),
  },
};

// ---- Document Type Definitions ---- //
export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "*.mdx",
  contentType: "mdx",
  fields: sharedPostFields,
  computedFields: {
    ...sharedPostComputedFields,
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

export const BlogSeries = defineDocumentType(() => ({
  name: "BlogSeries",
  filePathPattern: "*/*.mdx",
  contentType: "mdx",
  fields: {
    ...sharedPostFields,
    series: {
      type: "string",
      description: "The short name of the series",
      required: true,
    },
    seriesTitle: {
      type: "string",
      description: "The full title of the series",
      required: true,
    },
    seriesOrder: {
      type: "number",
      description: "The order of the post within the series",
      required: true,
    },
  },
  computedFields: {
    ...sharedPostComputedFields,
    url: {
      type: "string",
      resolve: (doc) => {
        const segments = doc._raw.flattenedPath.split("/");
        return `/blog/${segments.join("/")}`;
      },
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
    seriesSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[0],
    },
  },
}));
