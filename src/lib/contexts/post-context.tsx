"use client";

import React, { createContext, useContext } from "react";

import { type BlogContent } from "contentlayer/utils";

type PostContextType = {
  post: BlogContent;
  next: BlogContent | undefined;
  prev: BlogContent | undefined;
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
