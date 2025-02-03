import { allBlogs } from "contentlayer/generated";

import * as Preview from "@/components/post-preview";
import { ListLayoutTags } from "@/components/layouts/list-layout-tags";
import { PublicationDate } from "@/components/reading-time";

export default async function Page() {
  return (
    <ListLayoutTags>
      {allBlogs.map((post) => (
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
