import { allBlogs } from "contentlayer/generated";
import { slug } from "github-slugger";

import * as Preview from "@/components/post-preview";
import { PublicationDate } from "@/components/reading-time";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import tagData from "@/data/tag-data.json";

export const generateStaticParams = async () => {
  return Object.keys(tagData).map((tag) => ({
    tag: encodeURI(tag),
  }));
};

export default async function TagPage(props: { params: { tag: string } }) {
  const { tag } = await props.params;

  const filteredPosts = allBlogs.filter(
    (post) => !post.draft && post.tags.map((t) => slug(t)).includes(tag),
  );

  return (
    <ListLayoutTags>
      {filteredPosts.map((post) => (
        <div key={post._id} className="w-full">
          <PublicationDate
            date={post.date}
            className="inline-block text-md pb-1"
          />

          <div className="overflow-hidden">
            <Preview.Title title={post.title} slug={post.slug} />

            <Preview.Tags
              items={post.tags.map((tag) => (
                <Preview.Tag key={tag} tag={tag} />
              ))}
            />

            <Preview.Desription
              description={post.description}
              characterLimit={280}
            />
          </div>
        </div>
      ))}
    </ListLayoutTags>
  );
}
