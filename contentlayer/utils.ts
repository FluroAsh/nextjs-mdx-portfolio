import { type Blog, BlogSeries } from "contentlayer/generated";
import * as fs from "fs";
import { slug } from "github-slugger";
import * as path from "path";

import { getCoreContent } from "@/lib/helpers";

const isProduction = process.env.NODE_ENV === "production";

export type BlogContent = Blog | BlogSeries;

/** Count the occurrences of all tags across blog posts & store output in a `.json` file. */
export function createTagCount(allBlogs: BlogContent[]) {
  const tagCount: Record<string, number> = {};

  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || !file.draft)) {
      file.tags.forEach((tag: string) => {
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
export const createSearchIndex = (allBlogs: BlogContent[]) => {
  fs.writeFileSync(
    path.resolve("public/search.json"),
    JSON.stringify(getCoreContent(allBlogs)),
  );
  console.log("✅ Local search index generated!");
};
