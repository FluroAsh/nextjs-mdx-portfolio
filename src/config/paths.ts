export const paths = {
  home: {
    pathname: "/",
  },
  blog: {
    pathname: "/blog",
  },
  gallery: {
    pathname: "/gallery",
  },
  notFound: {
    pathname: "/404",
  },
  post: {
    getPathname: (slug: string) => `/blog/${slug}`,
  },
  tags: {
    pathname: "/tags",
  },
  tag: {
    getPathname: (tag: string) => `/tags/${tag}`,
  },
};

export const isActive = (pathname: string, targetPath: string) =>
  targetPath.includes(`${paths.tags.pathname}/`) || isBlogPage(pathname);

const isBlogPage = (pathname: string) =>
  pathname === paths.blog.pathname || /^\/blog\/page\/\d+$/.test(pathname);
