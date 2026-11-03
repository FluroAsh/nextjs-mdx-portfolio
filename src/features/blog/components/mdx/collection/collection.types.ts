export type ImageProps = {
  src: string;
  alt?: string;
  caption?: string;
  useLowerRes?: boolean;
};

/** Grid layout of a collection, named by how many images it holds. */
export type CollectionVariant = "2up" | "3up" | "4up" | "6up";
