import Image from "next/image";

import { type BlogContent } from "contentlayer/utils";

import { cn } from "@/utils/misc";

/** Text sits on the left, so the scrim clears toward the right edge. A flat
 *  darkening can't do both jobs: dark enough for prose kills the photograph. */
const WIDE_SCRIM =
  "linear-gradient(to right, rgba(10,13,11,0.96) 0%, rgba(10,13,11,0.94) 62%, rgba(10,13,11,0.6) 85%, rgba(10,13,11,0.45) 100%)";

/** Folded there is no horizontal room to trade, so the tile darkens bottom-up. */
const NARROW_SCRIM =
  "linear-gradient(to top, rgba(10,13,11,0.96) 0%, rgba(10,13,11,0.9) 55%, rgba(10,13,11,0.55) 100%)";

/**
 * Image, hue wash, and scrim. No CRT layer here — one plane covers the whole
 * section, and repeating it per tile double-exposes the texture.
 */
export const PostBackdrop = ({ post }: { post: BlogContent }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <Image
      src={post.image}
      alt=""
      fill
      sizes="(min-width: 900px) 320px, 100vw"
      // Stops short of full colour so a lit tile stays inside the one hue.
      className={cn(
        "object-cover brightness-[0.6] grayscale-100",
        "group-hover:brightness-95 group-hover:grayscale-[0.45]",
        "transition-[filter] duration-150 ease-linear motion-reduce:transition-none",
      )}
      unoptimized // Remote URLs are already served as optimised variants.
    />

    <div
      className={cn(
        "absolute inset-0 bg-green-400/10 mix-blend-color",
        "transition-opacity duration-150 ease-linear group-hover:opacity-60",
        "motion-reduce:transition-none",
      )}
    />

    {/* Thins on hover, never to zero — the excerpt still has to stay legible against a bright photograph. */}
    <div
      className="fold:hidden absolute inset-0 transition-opacity duration-150 ease-linear group-hover:opacity-85 motion-reduce:transition-none"
      style={{ backgroundImage: WIDE_SCRIM }}
    />
    <div
      className="fold:block absolute inset-0 hidden transition-opacity duration-150 ease-linear group-hover:opacity-85 motion-reduce:transition-none"
      style={{ backgroundImage: NARROW_SCRIM }}
    />

    {/* Stacked, the chrome row runs past where the horizontal scrim has thinned out, so the top band needs darkening separately. */}
    <div
      className="fold:hidden absolute inset-x-0 top-0 h-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(10,13,11,0.85), transparent)",
      }}
    />
  </div>
);

/** Three corners, bottom-right omitted — a closed frame is a box, an open one
 *  is a viewport. */
export const TileBrackets = () => (
  <span aria-hidden className="pointer-events-none absolute inset-0">
    <span className="absolute top-0 left-0 size-3 border-t border-l border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
    <span className="absolute top-0 right-0 size-3 border-t border-r border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
    <span className="absolute bottom-0 left-0 size-3 border-b border-l border-green-500/50 transition-colors duration-75 group-hover:border-green-300/70" />
  </span>
);
