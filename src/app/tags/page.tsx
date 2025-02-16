import Link from "next/link";

import tagData from "@/data/tag-data.json" assert { type: "json" };
import { paths } from "@/config/paths";

export default function Page() {
  const tags = Object.entries(tagData);

  return (
    <div className="grid grid-cols-2 place-items-center mx-auto max-w-screen-lg py-8 px-6">
      <h1 className="text-4xl pb-4">Tags</h1>

      <div className="flex gap-4 flex-wrap">
        {tags.map(([tag, count]) => (
          <div key={tag}>
            <Link
              href={paths.tag.getPathname(tag)}
              className="text-lg font-semibold uppercase hover:text-green-500 transition-colors duration-75 leading-none"
            >
              {tag} <span className="font-mono text-sm">({count})</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
