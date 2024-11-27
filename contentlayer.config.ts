import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// https://contentlayer.dev/docs/sources/files/mdx-d747e46d
// const Post = defineDocumentType(() => ({
//   name: "Post",
//   // filePathPattern: "Post/**/*.mdx",
//   // contentType: "mdx",
//   // fields: {
//   //   title: { type: "string", required: true },
//   //   date: { type: "date", required: true },
//   //   categories: { type: "list", of: { type: "string" }, default: [] },
//   //   draft: { type: "boolean" },
//   //   featured: { type: "boolean" },
//   //   ["featured-image"]: { type: "string", required: true },
//   //   layout: { type: "string" },
//   //   canonicalUrl: { type: "string" },
//   // },
//   // computedFields: {
//   //   slug: {
//   //     type: "string",
//   //     resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
//   //   },
//   //   path: {
//   //     type: "string",
//   //     resolve: (doc) => doc._raw.flattenedPath,
//   //   },
//   //   filePath: {
//   //     type: "string",
//   //     resolve: (doc) => doc._raw.sourceFilePath,
//   //   },
//   //   url: {
//   //     type: "string",
//   //     resolve: (blog) => `/blog/${blog._raw.flattenedPath}`,
//   //   },
//   // },
//   filePathPattern: `blog/**/*.md`,
//   fields: {
//     title: { type: "string", required: true },
//     date: { type: "date", required: true },
//   },
//   computedFields: {
//     url: {
//       type: "string",
//       resolve: (post) => `/blog/${post._raw.flattenedPath}`,
//     },
//   },
// }));

// export default makeSource({
//   contentDirPath: "posts",
//   mdx: {
//     // plugins etc.
//     // cwd: process.cwd(),
//   },
//   documentTypes: [Post],
// });

//

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

export default makeSource({
  contentDirPath: "blog",
  mdx: {
    // cwd: process.cwd(),
  },
  documentTypes: [Blog],
});
