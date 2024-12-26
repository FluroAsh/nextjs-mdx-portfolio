import { allBlogs } from "contentlayer/generated";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="py-8 mx-auto max-w-xl">
      <div className="pb-2">
        <p className="text-3xl">All Posts</p>
      </div>

      {/* TODO: PostsLayout */}
      <div className="flex gap-4">
        {allBlogs.map((post) => (
          <div key={post._id} className="flex-1 bg-neutral-600 p-4">
            <p className="">{post.title}</p>
            <Link className="text-sky-500 underline" href={post.url}>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
