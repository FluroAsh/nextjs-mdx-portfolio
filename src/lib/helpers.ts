import { type Blog } from "contentlayer/generated";

import { POSTS_PER_PAGE } from "@/config/site";
import { sortByDate } from "@/features/blog/utils";
import { BlogContent } from "contentlayer/utils";

export const getPaginatedPosts = (page: number, posts: BlogContent[]) => {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = page * POSTS_PER_PAGE;

  const paginatedPosts = posts.slice(start, end);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return {
    paginatedPosts,
    totalPages,
  };
};

export const filterDraftPosts = (posts: BlogContent[]) => {
  return posts.filter((post) => !post.draft);
};

export const getCoreContent = (posts: BlogContent[]) =>
  posts
    .filter((post) =>
      process.env.NODE_ENV === "production" ? !post.draft : true,
    )
    .sort(sortByDate)
    .map((post) => {
      const newPost: Partial<BlogContent> = { ...post };

      delete newPost._id;
      delete newPost._raw;
      delete newPost.body;
      delete newPost.toc;
      delete newPost.draft;

      return newPost as Exclude<
        Blog,
        "_id" | "_raw" | "body" | "toc" | "draft"
      >;
    });
