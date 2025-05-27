export type ImageProps = {
  src: string;
  alt?: string;
  caption?: string;
  useLowerRes?: boolean;
};

export enum IMAGE_SIZE {
  THUMBNAIL = "thumbnail",
  // SMALL = 'small',
  MEDIUM = "medium",
  LARGE = "large",
}
