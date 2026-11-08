import { requireManifest } from "@/server/image";

import { getGallery } from "./get-gallery";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_S3_HOSTNAME = "images.example.com";
});
vi.mock("@/data/content", () => ({
  allBlogContent: [{ slug: "japan-2025/tokyo" }],
}));
vi.mock("@/server/image", () => ({
  requireManifest: vi.fn(),
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
  vi.mocked(requireManifest).mockResolvedValue({
    width: 100,
    height: 50,
    measured: true,
    base64: "blur",
    orientation: "landscape",
    candidates: [],
  });
});

describe("getGallery", () => {
  it("is empty on 404", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 404 }));
    expect(await getGallery()).toEqual({ photos: [], albums: [] });
  });

  it.each([403, 503])("throws on %i, naming the URL", async (status) => {
    fetchMock.mockResolvedValue(new Response("", { status }));
    await expect(getGallery()).rejects.toThrow(
      `gallery/collections.json: HTTP ${status}`,
    );
  });

  it("throws on a network error, naming the URL", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(getGallery()).rejects.toThrow(
      "gallery/collections.json: request failed",
    );
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

  it("builds the large URL for a Strapi set", async () => {
    serve([collection({ photos: [photo("legacy/old")] })]);
    const { photos } = await getGallery();
    expect(photos[0].src).toBe(
      "https://images.example.com/legacy/old/large_old.webp",
    );
  });

  it("builds the large URL for an upload-bucket set", async () => {
    serve([collection({ photos: [photo("japan-2025/tokyo/day-1/name")] })]);
    const { photos } = await getGallery();
    expect(photos[0].src).toBe(
      "https://images.example.com/japan-2025/tokyo/day-1/name/large_name.webp",
    );
  });

  it("rejects a set listed twice", async () => {
    serve([collection(), collection({ slug: "other" })]);
    await expect(getGallery()).rejects.toThrow("Set listed twice: a/one");
  });

  it("rejects a set without a manifest", async () => {
    serve([collection()]);
    vi.mocked(requireManifest).mockRejectedValue(new Error("no manifest"));
    await expect(getGallery()).rejects.toThrow("no manifest");
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
