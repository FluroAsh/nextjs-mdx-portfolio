"use client";

import { useEffect, useRef, useState } from "react";

import { usePostContext } from "@/lib/contexts/post-context";
import { type TocItem } from "@/lib/plugins/extract-headings";
import { cn, zeroPad } from "@/utils/misc";

import { PanelBlock, Readout } from "./block";

const CONTENTS_MARKER = { zh: "目錄", en: "CONTENTS" };

/** `toc` comes through Contentlayer as untyped JSON. */
const tocOf = (post: { toc: unknown }) => post.toc as TocItem[];

const idOf = (heading: TocItem) => heading.url.split("#")[1];

const useActiveHeading = (toc: TocItem[]) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = document.querySelectorAll(
      "h2.content-header, h3.content-header, h4.content-header",
    );

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: "0% 0% -60% 0%" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  return activeId;
};

const useScrollEdges = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setEdges({
        top: scrollTop > 2,
        bottom: scrollTop + clientHeight < scrollHeight - 2,
      });
    };

    measure();
    el.addEventListener("scroll", measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  return { ref, edges };
};

/** Offsets are measured against the list, so the indicator stays put while the list scrolls. */
const useTrackIndicator = (activeId: string) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    if (!row) return setIndicator((prev) => ({ ...prev, opacity: 0 }));

    setIndicator({ top: row.offsetTop, height: row.offsetHeight, opacity: 1 });
  }, [activeId]);

  return { listRef, indicator };
};

/** A mask, not a gradient overlay — the panel fill is not a flat colour. */
const fadeMask = ({ top, bottom }: { top: boolean; bottom: boolean }) => {
  const start = top ? "32px" : "0px";
  const end = bottom ? "32px" : "0px";

  return `linear-gradient(to bottom, transparent 0, black ${start}, black calc(100% - ${end}), transparent 100%)`;
};

export const ContentsBlock = () => {
  const { post } = usePostContext();
  const toc = tocOf(post);
  const activeId = useActiveHeading(toc);
  const activeIndex = toc.findIndex((h) => idOf(h) === activeId);
  const { ref, edges } = useScrollEdges();
  const { listRef, indicator } = useTrackIndicator(activeId);

  // A long list scrolls the active row out of view without this.
  useEffect(() => {
    ref.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId, ref]);

  return (
    <PanelBlock
      // `min-h-0` is load-bearing — without it the list never scrolls.
      className="min-h-0 flex-1"
      flush
      marker={CONTENTS_MARKER}
      trailing={
        <Readout>
          {zeroPad(Math.max(activeIndex + 1, 1))}/{zeroPad(toc.length)}
        </Readout>
      }
    >
      <div
        ref={ref}
        className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-4 pb-4"
        style={{
          scrollbarGutter: "stable", // `stable` stops rows reflowing when the bar appears.
          maskImage: fadeMask(edges),
          WebkitMaskImage: fadeMask(edges),
        }}
      >
        <ul ref={listRef} className="relative border-l border-green-500/20">
          <span
            aria-hidden
            className="absolute -left-px w-0.5 bg-green-400 transition-all duration-300 ease-out motion-reduce:transition-none"
            style={indicator}
          />

          {toc.map((heading) => {
            const isActive = idOf(heading) === activeId;

            return (
              <li key={heading.url}>
                <a
                  href={heading.url}
                  data-active={isActive}
                  className={cn(
                    "block py-1 pl-3 font-mono text-[11px] tracking-wide transition-colors duration-150 ease-linear",
                    heading.depth > 2 && "pl-6",
                    isActive
                      ? "text-green-300"
                      : "text-neutral-400 hover:text-green-400",
                  )}
                >
                  <span className="block truncate">{heading.value}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </PanelBlock>
  );
};
