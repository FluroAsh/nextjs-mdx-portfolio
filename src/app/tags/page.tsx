import Link from "next/link";

import tagData from "@/data/tag-data.json" assert { type: "json" };
import { paths } from "@/config/paths";

export default function Page() {
  const tags = Object.entries(tagData);

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 place-items-center px-6 py-8">
      <h1 className="pb-4 text-4xl">Tags</h1>

      <div className="flex flex-wrap gap-4">
        {tags.map(([tag, count]) => (
          <div key={tag}>
            <Link
              href={paths.tag.getPathname(tag)}
              className="text-lg leading-none font-semibold uppercase transition-colors duration-75 hover:text-green-500"
            >
              {tag} <span className="font-mono text-sm">({count})</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
