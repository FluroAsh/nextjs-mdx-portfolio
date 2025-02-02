import Link from "next/link";

import tagData from "@/data/tag-data.json" assert { type: "json" };

export default async function Page() {
  return (
    <div className="mx-auto max-w-screen-lg py-8 px-6">
      <h1 className="text-4xl pb-4">Tags</h1>

      {Object.entries(tagData).map(([tag, count]) => (
        <div key={tag}>
          <Link
            href={`tags/${tag}`}
            className="font-semibold uppercase hover:text-green-500 transition-colors duration-75"
          >
            {tag} <span className="font-mono">({count})</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
