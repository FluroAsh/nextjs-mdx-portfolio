import { altToFilename } from "@/utils/image";

/** Cross-origin `download` attributes are ignored, so the file is fetched and saved as a blob; `name` is plain text, such as the alt. */
export const downloadImage = async (src: string, name: string) => {
  try {
    const url = new URL(src, window.location.href);
    const extension = /\.\w+$/.exec(url.pathname)?.[0] ?? "";
    /** A cached copy fetched without CORS headers would fail the request, so the param asks for a fresh one. */
    url.searchParams.set("download", "");

    const response = await fetch(url);
    if (!response.ok) throw new Error(String(response.status));
    const blobUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `${altToFilename(name)}${extension}`;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(src, "_blank", "noopener");
  }
};
