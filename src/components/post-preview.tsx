import Link from "next/link";
import { slug } from "github-slugger";

export const Desription = ({
  description,
  characterLimit,
}: {
  description: string;
  characterLimit: number;
}) => {
  return (
    <p className="prose prose-invert">
      {description.length > characterLimit
        ? `${description.slice(0, characterLimit)}...`
        : description}
    </p>
  );
};

export const Tag = ({ tag }: { tag: string }) => (
  <li className="inline-block text-green-500 hover:text-green-300">
    <Link href={`/tags/${slug(tag)}`}>{tag}</Link>
  </li>
);

export const Tags = ({ items }: { items: React.ReactNode }) => (
  <ul className="flex gap-2 whitespace-nowrap flex-wrap gap-y-0 pb-2">
    {items}
  </ul>
);

export const Title = ({ title, slug }: { title: string; slug: string }) => (
  <Link
    href={`/blog/${slug}`}
    className="inline-block pb-1 leading-8 hover:text-green-500  text-2xl tracking-tight transition-colors duration-75"
  >
    <h2>{title}</h2>
  </Link>
);
