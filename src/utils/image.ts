export const getFileNameFromUrl = (url: string) => {
  const newURL = new URL(url);
  return newURL.pathname.split("/").pop() || "";
};

/**
 * Transforms alt text into a safe filename format for downloading images.
 * Replaces spaces with dashes, removes non-alphanumeric characters (except dashes),
 * and converts to lowercase.
 */
export const altToFilename = (text: string) =>
  text
    .replace(/ /g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove any non-alphanumeric characters
    .toLowerCase();
