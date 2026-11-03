import { FETCH_FAILED, readManifest } from "@/server/image";

import { getGallery } from "./get-gallery";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_S3_HOSTNAME = "images.example.com";
});
vi.mock("@/data/content", () => ({
  allBlogContent: [{ slug: "japan-2025/tokyo" }],
}));
vi.mock("@/server/image", () => ({
  FETCH_FAILED: Symbol("failed"),
  readManifest: vi.fn(),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const photo = (set: string, alt: string | null = "Alt") => ({
  set,
  alt,
  caption: null,
  tags: [],
});
const collection = (over: object = {}) => ({
  slug: "tokyo",
  name: "Tokyo",
  photos: [photo("a/one"), photo("a/two")],
  ...over,
});
const serve = (collections: object[]) =>
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ schema: 1, collections })),
  );

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(readManifest).mockResolvedValue({
    width: 100,
    height: 50,
    measured: true,
    base64: "blur",
    orientation: "landscape",
    candidates: [],
  });
});

describe("getGallery", () => {
  it.each([403, 404])("is empty on %i", async (status) => {
    fetchMock.mockResolvedValue(new Response("", { status }));
    expect(await getGallery()).toEqual({ photos: [], albums: [] });
  });

  it("throws on a 5xx", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 503 }));
    await expect(getGallery()).rejects.toThrow("HTTP 503");
  });

  it("builds photos and albums", async () => {
    serve([collection({ post: "japan-2025/tokyo" })]);
    const { photos, albums } = await getGallery();
    expect(photos.map((p) => [p.id, p.frame, p.album])).toEqual([
      ["a/one", 1, "tokyo"],
      ["a/two", 2, "tokyo"],
    ]);
    expect(photos[0].src).toBe(
      "https://images.example.com/a/one/large_one.webp",
    );
    expect(albums).toEqual([
      expect.objectContaining({
        title: "Tokyo",
        postPath: "/blog/japan-2025/tokyo",
      }),
    ]);
  });

  it("rejects a set listed twice", async () => {
    serve([collection(), collection({ slug: "other" })]);
    await expect(getGallery()).rejects.toThrow("Set listed twice: a/one");
  });

  it("rejects a missing manifest", async () => {
    serve([collection()]);
    vi.mocked(readManifest).mockResolvedValue(null);
    await expect(getGallery()).rejects.toThrow("a/one");
  });

  it("rejects a failed manifest fetch", async () => {
    serve([collection()]);
    vi.mocked(readManifest).mockResolvedValue(FETCH_FAILED);
    await expect(getGallery()).rejects.toThrow("a/one");
  });

  it("rejects a cover outside the collection", async () => {
    serve([collection({ cover: "b/other" })]);
    await expect(getGallery()).rejects.toThrow("b/other");
  });

  it("rejects a post that is not a blog post", async () => {
    serve([collection({ post: "nope" })]);
    await expect(getGallery()).rejects.toThrow('post "nope"');
  });

  it("warns on missing alt text", async () => {
    serve([collection({ photos: [photo("a/one", null)] })]);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await getGallery();
    expect(warn).toHaveBeenCalledWith("Missing alt text: a/one");
  });
});
