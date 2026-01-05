"use client";

export const Gif = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) => {
  return (
    <div className="mx-auto max-w-fit">
      <img className="" src={src} alt={alt} />
      {caption && <em>{caption}</em>}
    </div>
  );
};
