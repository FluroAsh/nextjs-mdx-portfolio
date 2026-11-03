export type ImageProps = {
  src: string;
  alt?: string;
  caption?: string;
  useLowerRes?: boolean;
};

/** Grid layout of a collection, named by how many images it holds. */
export const COLLECTION_VARIANTS = ["2up", "3up", "4up", "6up"] as const;

export type CollectionVariant = (typeof COLLECTION_VARIANTS)[number];
