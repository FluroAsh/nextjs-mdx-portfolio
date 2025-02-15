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
