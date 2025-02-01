"use client";

import { createContext, useContext } from "react";
import { type Blog } from "contentlayer/generated";

type PostContextType = {
  post: Blog;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({
  post,
  children,
}: {
  post: Blog;
  children: React.ReactNode;
}) => <PostContext.Provider value={{ post }}>{children}</PostContext.Provider>;

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }

  return context;
};
