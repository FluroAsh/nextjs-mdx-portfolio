import { isActiveRoute, isTagActive } from "./paths";

describe("isActiveRoute", () => {
  it.each([
    [true, "/blog", ["/blog", "/gallery"]],
    [true, "/blog", ["/blog"]],
    [false, "/blog", ["/gallery"]],
    [false, "/tags", ["/blog", "/gallery"]],
    [true, "/tags", ["/tags"]],
  ])(
    "should return %s if the pathname is %s and targetPaths is %s",
    (expected, pathname, targetPath) => {
      expect(isActiveRoute(pathname, targetPath)).toBe(expected);
    },
  );
});

describe("isTagActive", () => {
  it.each([
    [true, "/tags/react", "react"],
    [true, "/tags/react/page/1", "react"],
    [false, "/tags/react/page/1", "vue"],
    [false, "/tags/react", "vue"],
  ])(
    "should return %s if the pathname is %s and tag is %s",
    (expected, pathname, tag) => {
      expect(isTagActive(pathname, tag)).toBe(expected);
    },
  );
});
