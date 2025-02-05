import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { type TocItem } from "@/lib/plugins/extract-headings";
import { usePostContext } from "@/lib/providers/post-provider";

const getPaddingClass = (depth: number) => {
  const paddingMap = [undefined, "pl-2", "pl-6", "pl-10", "pl-12", "pl-16"];
  return paddingMap[depth - 2];
};

const TOCHeading = ({
  id,
  activeId,
  heading,
}: {
  id: string;
  activeId: string;
  heading: TocItem;
}) => (
  <li
    className={cn(
      getPaddingClass(heading.depth),
      activeId === id ? "text-green-500 brightness-125" : "text-neutral-400",
      activeId !== id && "hover:text-neutral-200",
      "list-none text-sm leading-6 transition-colors duration-75 font-semibold",
    )}
  >
    <a className="block truncate whitespace-nowrap" href={heading.url}>
      {heading.value}
    </a>
  </li>
);

export const TableOfContents = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const [activeId, setActiveId] = useState<string>(() =>
    window.location.hash ? window.location.hash.slice(1) : "",
  );
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const tocHeadings: TocItem[] = usePostContext().post.toc;

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("h2, h3, h4, h5, h6"),
    ).filter((heading) => heading.classList?.contains("content-header"));

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const topObserver = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      { rootMargin: "0% 0% -25% 0%" },
    );

    for (const heading of headings) {
      if (heading) topObserver.observe(heading);
    }

    return () => topObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeId && listRef.current) {
      const activeElement = listRef.current.querySelector(
        `a[href="#${activeId}"]`,
      )?.parentElement;

      if (activeElement) {
        const { offsetTop, offsetHeight } = activeElement as HTMLElement;
        setIndicatorStyle({
          opacity: "1",
          transform: `translate(-50%, ${offsetTop}px)`,
          height: `${offsetHeight}px`,
        });
      }
    }
  }, [activeId]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        const lastHeading = tocHeadings[tocHeadings.length - 1];
        if (lastHeading) setActiveId(lastHeading.url.split("#")[1]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocHeadings]);

  return (
    <nav className="sticky top-4 my-4 px-2 ">
      <h3 className="font-bold mb-2 uppercase">Contents</h3>
      <div className="relative">
        <div
          className="opacity-0 absolute left-0 w-[3px] bg-green-500 transition duration-300"
          style={indicatorStyle}
        />
        <ul
          className="list-inside list-decimal tracking-wide border-l border-neutral-500 pl-4"
          ref={listRef}
        >
          {tocHeadings.map((heading) => (
            <TOCHeading
              key={heading.url}
              heading={heading}
              id={heading.url.split("#")[1]}
              activeId={activeId}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};
