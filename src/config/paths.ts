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

// FIXME: "ALL POSTS" not active when on a paginated page (eg: /blog/page/2)
export const isActive = (pathname: string, path: string) =>
  pathname.includes(path) ||
  (pathname.includes(paths.tags.pathname) && path === paths.blog.pathname);
