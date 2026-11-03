export type ImageProps = {
  src: string;
  alt?: string;
  caption?: string;
  useLowerRes?: boolean;
};

/** Grid layout of a collection, named by how many images it holds. */
export const CollectionVariant = {
  TwoUp: "2up",
  ThreeUp: "3up",
  FourUp: "4up",
  SixUp: "6up",
} as const;

export type CollectionVariant =
  (typeof CollectionVariant)[keyof typeof CollectionVariant];
