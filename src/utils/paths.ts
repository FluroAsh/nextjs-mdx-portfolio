import { paths } from "@/config/paths";

export const isActive = (pathname: string, path: string) =>
  pathname.includes(path) ||
  (pathname.includes(paths.tags.pathname) && path === paths.blog.pathname);
