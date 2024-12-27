import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="pr-10 w-[250px] hidden lg:block">
      <Author
        name="Ashley Thompson"
        socials={["ashleygthompson", "LinkedIn"]}
      />
      <hr className="my-2" />

      <Tags items={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]} />
      <hr className="my-2" />

      {/* NOTE: If none exists, don't render this element */}
      <PreviousArticle heading="Previous Article" article="Name of the Article">
        <div className="mt-2">
          &larr;{" "}
          <Link
            className="hover:text-green-500 underline transition-colors text-sm"
            href="/blog"
          >
            Back to Blog
          </Link>
        </div>
      </PreviousArticle>

      <hr className="my-2" />

      <TOC />
    </aside>
  );
}

const Author = ({ name, socials }: { name: string; socials: string[] }) => {
  return (
    <div className="flex py-2">
      <div className="bg-neutral-600 size-12 rounded-full mr-2 aspect-square"></div>
      <div className="leading-6 flex flex-col justify-center">
        <p className="font-bold">{name}</p>
        <p className="text-sm">
          {socials.map((handle) => `@${handle}`).join(" ")}
        </p>
      </div>
    </div>
  );
};

const Tags = ({ items }: { items: string[] }) => {
  return (
    <div className="my-4 px-2">
      <p className="font-bold">TAGS</p>
      <ul className="list-inside flex flex-wrap gap-x-2 gap-y-1 text-green-500">
        {items.map((item, idx) => (
          <li key={`tag-${idx}`} className="text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PreviousArticle = ({
  heading,
  article,
  children,
}: {
  heading: string;
  article: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="my-4 px-2">
      <p className="font-bold uppercase">{heading}</p>
      <p className="text-sm">{article}</p>
      {children}
    </div>
  );
};

const TOC = () => {
  return (
    <nav className="sticky top-4 my-4 px-2">
      <h2 className="text-lg font-bold mb-2 uppercase">Table of Contents</h2>
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
  );
};
