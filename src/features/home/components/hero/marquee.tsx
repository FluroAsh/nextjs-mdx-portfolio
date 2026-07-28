"use client";

import Link from "next/link";

import { LucideArrowDown } from "lucide-react";

import { Marquee } from "@/components/marquee";
import {
  ABOUT_ANCHOR_ID,
  ABOUT_MARKER,
  type BilingualPair,
  LATEST_MARKER,
  type LatestPost,
  SYSTEM_MARKER,
  type SystemStatus,
} from "@/data/identity";
import { cn } from "@/utils/misc";

/** Scrolls to the element rather than a fixed offset, so it stays correct when
 *  the header height or viewport changes. */
const scrollToAbout = () => {
  document
    .getElementById(ABOUT_ANCHOR_ID)
    ?.scrollIntoView({ block: "start", inline: "nearest" });
};

/**
 * The strip that closes the hero. A flex row rather than an overlay, so the
 * name block shrinks around it on short screens. The fixed block on the left
 * doubles as the scroll button and gives the moving text something to appear
 * from behind.
 */

/** Pixels per second. Any faster and the titles are hard to read. */
const CRAWL_SPEED = 48;

const Chevron = () => (
  <span aria-hidden className="text-green-600">
    ›
  </span>
);

const Marker = ({ zh, en }: BilingualPair) => (
  <span className="flex shrink-0 items-baseline gap-1.5">
    <span className="text-green-400">{zh}</span>
    <span className="text-green-600">{en}</span>
  </span>
);

const FeedPass = ({
  posts,
  system,
}: {
  posts: LatestPost[];
  system: SystemStatus;
}) => (
  // This padding is the gap between one loop and the next, so it has to be on
  // the copy rather than the container — see `animations.css`.
  <div className="flex shrink-0 items-center gap-4 px-4 whitespace-nowrap sm:gap-5 sm:px-5">
    <Marker {...LATEST_MARKER} />

    {posts.map((post) => (
      <span key={post.url} className="flex items-center gap-4 sm:gap-5">
        <Chevron />
        {/* Two elements because CSS can't swap a link for a span at `sm`.
            `tabIndex={-1}` because nothing inside an `aria-hidden` element
            should be focusable — the real links are in the list below. */}
        <Link
          href={post.url}
          tabIndex={-1}
          className={cn(
            "hidden text-neutral-200",
            "transition-colors hover:text-green-400",
            "sm:inline",
          )}
        >
          {post.title}
        </Link>
        <span className="text-neutral-200 sm:hidden">{post.title}</span>
        <span className="text-green-600">{post.date}</span>
      </span>
    ))}

    <Chevron />
    <Marker {...SYSTEM_MARKER} />

    <Chevron />
    <span className="text-neutral-200">{system.commitSubject}</span>

    <span className="flex items-center gap-4 sm:gap-5">
      <Chevron />
      <span className="text-green-600">DEPLOYED {system.deployedAt}</span>
      <Chevron />
      <span className="text-green-600">BUILD {system.buildId}</span>
    </span>
  </div>
);

export const HeroMarquee = ({
  posts,
  system,
}: {
  posts: LatestPost[];
  system: SystemStatus;
}) => (
  <div
    className={cn(
      "bg-surface-recess relative z-10 flex border-y border-green-500/40",
      "font-mono text-[11px] tracking-wider",
      "sm:text-[10px]",
    )}
  >
    <button
      type="button"
      onClick={scrollToAbout}
      className={cn(
        "group relative z-10 flex shrink-0 items-center gap-2 px-4 py-3",
        "border-r border-green-500/40 text-green-600",
        "transition-colors hover:text-green-400",
        "sm:py-2.5",
      )}
    >
      <span aria-hidden className="hidden text-green-400 sm:inline">
        {ABOUT_MARKER.zh}
      </span>
      <span>{ABOUT_MARKER.en}</span>

      <LucideArrowDown
        aria-hidden
        className="size-3 -translate-y-[0.5px]"
        strokeWidth={2}
      />
    </button>

    <Marquee
      aria-hidden
      className="flex-1"
      copyClassName="py-3 sm:py-2.5"
      speed={CRAWL_SPEED}
    >
      <FeedPass posts={posts} system={system} />
    </Marquee>

    {/* What keyboard and screen reader users get. Tabbing into a scrolling
        container makes the browser scroll to the focused link, which fights
        the animation. */}
    <ul className="sr-only">
      {posts.map((post) => (
        <li key={post.url}>
          <Link href={post.url}>
            {post.title} — {post.date}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
