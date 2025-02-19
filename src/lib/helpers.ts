import { type Blog } from "contentlayer/generated";

import { POSTS_PER_PAGE } from "@/config/site";

export const getPaginatedPosts = (page: number, posts: Blog[]) => {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = page * POSTS_PER_PAGE;

  const paginatedPosts = posts.slice(start, end);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return {
    paginatedPosts,
    totalPages,
  };
};

export const filterDraftPosts = (posts: Blog[]) => {
  return posts.filter((post) => !post.draft);
};
