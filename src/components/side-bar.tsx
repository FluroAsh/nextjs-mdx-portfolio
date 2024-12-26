import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="pr-10 w-[250px]">
      {/* Author Section */}
      <div className="flex py-2">
        <div className="bg-neutral-600 size-12 rounded-full mr-2 aspect-square"></div>
        <div className="leading-6 flex flex-col justify-center">
          <p className="font-bold">Ashley Thompson</p>
          <p className="text-sm">@socials</p>
        </div>
      </div>

      <hr className="my-2" />

      {/* Tags Section */}
      <div className="my-4 px-2">
        <p className="font-bold">TAGS</p>
        <ul className="list-inside flex gap-2 text-green-500">
          <li className="text-sm">Tag 1</li>
          <li className="text-sm">Tag 2</li>
          <li className="text-sm">Tag 3</li>
        </ul>
      </div>

      <hr className="my-2" />

      {/* Preivous Article Section */}
      <div className="my-4 px-2">
        <p className="font-bold">PREVIOUS ARTICLE</p>
        <p className="text-sm">Name of the Article</p>
        <div className="mt-2">
          &larr;{" "}
          <Link
            className="hover:text-green-500 underline transition-colors text-sm"
            href="/blog"
          >
            Back to Blog
          </Link>
        </div>
      </div>

      <hr className="my-2" />

      {/* TOC Section */}
      <nav className="sticky top-4 my-4 px-2">
        <h2 className="text-lg font-bold mb-2 ">TABLE OF CONTENTS</h2>
        <ul className="list-inside list-decimal tracking-wide">
          <li className="mb-2">
            Heading 1
            <ol className="list-inside list-decimal ml-4">
              <li className="mb-1 text-sm">Subheading 1</li>
              <li className="mb-1 text-sm">Subheading 2</li>
            </ol>
          </li>
          <li className="mb-2">Heading 2</li>
          <li className="mb-2">Heading 3</li>
        </ul>
      </nav>
    </aside>
  );
}
