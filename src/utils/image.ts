export const getFileNameFromUrl = (url: string) => {
  const newURL = new URL(url);
  return newURL.pathname.split("/").pop() || "";
};
