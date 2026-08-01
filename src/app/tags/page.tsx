import Link from "next/link";

import { paths } from "@/config/paths";
import { sortedTags } from "@/data/tags";

export default function Page() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 place-items-center px-2 py-8">
      <h1 className="pb-4 text-4xl">Tags</h1>

      <div className="flex flex-wrap gap-4">
        {sortedTags.map(({ tag, label, count }) => (
          <div key={tag}>
            <Link
              href={paths.tag.getPathname(tag)}
              className="text-lg leading-none font-semibold transition-colors duration-75 hover:text-green-500"
            >
              {label} <span className="font-mono text-sm">({count})</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
