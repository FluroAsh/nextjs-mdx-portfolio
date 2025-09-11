import { makeSource } from "contentlayer2/source-files";
import { Blog, BlogSeries } from "./contentlayer/document-types";
import { remarkPlugins, rehypePlugins } from "./contentlayer/plugins";
import { createTagCount, createSearchIndex } from "./contentlayer/utils";

export default makeSource({
  contentDirPath: "blog",
  mdx: {
    remarkPlugins,
    rehypePlugins,
  },
  documentTypes: [Blog, BlogSeries],
  onSuccess: async (importData) => {
    const { allBlogs, allBlogSeries } = await importData();
    const mergedBlogs = [...allBlogs, ...allBlogSeries];

    createTagCount(mergedBlogs);
    createSearchIndex(mergedBlogs);
  },
});
