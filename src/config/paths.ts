export const paths = {
  home: {
    getPathname: () => "/",
  },
  blog: {
    getPathname: () => "/blog",
  },
  gallery: {
    getPathname: () => "/gallery",
  },
  notFound: {
    getPathname: () => "/404",
  },
  post: {
    getPathname: (slug: string) => `/blog/${slug}`,
  },
  tags: {
    getPathname: () => "/tags",
  },
  tag: {
    getPathname: (tag: string) => `/tags/${tag}`,
  },
};
