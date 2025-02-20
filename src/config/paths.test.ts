import { isBlogPage } from "./paths";

describe("isBlogPage", () => {
  test.each([
    ["/blog", true],
    ["/blog/page/1", true],
    ["/tags", false],
    ["/tags/blog", false],
    ["/", false],
  ])("should return %s if the pathname is %s", (pathname, expected) => {
    expect(isBlogPage(pathname)).toBe(expected);
  });
});
