"use client";

import { motion as m } from "motion/react";

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { type: "spring", stiffness: 100, staggerChildren: 0.08 },
  },
};

/** Labels must match `list` — renaming one silently drops the stagger. */
export const card = {
  hidden: { y: -10, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export const PostList = ({ children }: { children: React.ReactNode }) => (
  <m.div
    className="flex flex-col"
    variants={list}
    initial="hidden"
    animate="show"
  >
    {children}
  </m.div>
);
