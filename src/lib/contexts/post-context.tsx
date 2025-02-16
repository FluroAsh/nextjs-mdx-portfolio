"use client";

import React, { createContext, useContext } from "react";
import { type Blog } from "contentlayer/generated";

type PostContextType = {
  post: Blog;
  next: Blog | undefined;
  prev: Blog | undefined;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({
  post,
  next,
  prev,
  children,
}: PostContextType & { children: React.ReactNode }) => (
  <PostContext.Provider value={{ post, next, prev }}>
    {children}
  </PostContext.Provider>
);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }

  return context;
};
