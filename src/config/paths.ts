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
  tags: {
    pathname: "/tags",
  },
  tag: {
    getPathname: (tag: string) => `/tags/${tag}`,
  },
};

export const isActiveRoute = (pathname: string, targetPaths: string[]) =>
  targetPaths.some((path) => pathname.startsWith(path));

export const isTagActive = (pathname: string, tag: string) => {
  if (pathname.startsWith(paths.tag.getPathname(tag))) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const activeTag = pathSegments.length >= 2 ? pathSegments[1] : null;

    return activeTag === tag;
  }

  return false;
};
