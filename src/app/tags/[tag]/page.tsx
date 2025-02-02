import { slug } from "github-slugger";

import { PublicationDate } from "@/components/reading-time";
import tagData from "@/data/tag-data.json";
import ListLayoutTags from "@/layouts/list-layout-tags";
import { allBlogs } from "contentlayer/generated";
import Link from "next/link";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: { params: { tag: string } }) {
  const { tag } = await props.params;

  const characterLimit = 280;
  const filteredPosts = allBlogs.filter(
    (post) => !post.draft && post.tags.map((t) => slug(t)).includes(tag),
  );

  return (
    <ListLayoutTags>
      {filteredPosts.map((post) => (
        <div key={post._id} className="w-full">
          {/* Date */}
          <PublicationDate date={post.date} className="inline-block" />

          {/* Post Title */}
          <div className="overflow-hidden">
            <Link
              href={`/blog/${post.slug}`}
              className="leading-8 hover:text-green-500 inline-block text-2xl tracking-tight transition-colors duration-75"
            >
              <h2>{post.title}</h2>
            </Link>

            {/* Tags */}
            <ul className="flex gap-2 whitespace-nowrap flex-wrap gap-y-0 pb-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-block text-green-500 hover:text-green-300 font-semibold"
                >
                  <Link href={`/tags/${slug(tag)}`}>{tag}</Link>
                </li>
              ))}
            </ul>

            {/* Description */}
            <p className="prose prose-invert">
              {post.description.length > characterLimit
                ? `${post.description.slice(0, characterLimit)}...`
                : post.description}
            </p>
          </div>
        </div>
      ))}
    </ListLayoutTags>
  );
}
