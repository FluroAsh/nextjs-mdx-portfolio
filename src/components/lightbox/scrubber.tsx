"use client";

import { useEffect, useRef, useState } from "react";

import { motion as m } from "motion/react";

import { cn, zeroPad } from "@/utils/misc";

type ScrubberProps = {
  /** Number of slides in the set; one tick each. */
  count: number;
  /** Index of the slide on show; its tick sits at the middle of the rail. */
  index: number;
  /** Called once a move is final: a click, a key, or the end of a drag or wheel run. A drag or wheel run calls it before its preview clears. */
  onIndexChange: (index: number) => void;
  /** The slide a drag or wheel run is passing, for a preview; `null` once it ends. */
  onPreviewChange?: (index: number | null) => void;
  /** Which way the rail runs: `vertical` beside the photo for a pointer, `horizontal` under it for a finger. */
  orientation?: keyof typeof LAYOUTS;
  className?: string;
};

/** How the rail is drawn and read along one axis. */
type RailLayout = {
  /** Pixels from one tick to the next; also how far a drag travels per slide. */
  tick: number;
  /** Room in pixels a short strip keeps around itself, so its ends can fade in. */
  margin: number;
  /** The rail's thickness and which touch gestures the browser keeps. */
  root: string;
  /** Fades the strip out at both ends of the rail. */
  mask: string;
  /** Pins the strip's start to the middle of the rail. */
  strip: string;
  /** The slot one tick is centred in. */
  cell: string;
  /** A tick's thickness. */
  mark: string;
  /** Pins the needle to the middle of the rail, over the tick on show. */
  needle: string;
  /** The needle's length at rest, then a tick's when hovered and otherwise; the needle drops to the hovered length during a drag or wheel run. */
  lengths: [needle: string, hovered: string, rest: string];
};

const LAYOUTS = {
  vertical: {
    tick: 6,
    margin: 48,
    root: "w-8 touch-none",
    mask: "[mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]",
    strip: "top-1/2 left-0",
    cell: "flex items-center pl-2",
    mark: "h-px",
    needle: "top-1/2 left-2 -translate-y-1/2",
    lengths: ["w-5", "w-4", "w-3"],
  },
  /** Sized for a finger: a 44px touch area, wider tick spacing, and vertical drags left to the page's scroll. */
  horizontal: {
    tick: 8,
    margin: 96,
    root: "mx-auto h-11 touch-pan-y",
    mask: "[mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]",
    strip: "top-0 left-1/2 flex h-full",
    cell: "flex h-full items-center justify-center",
    mark: "w-px",
    needle: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    lengths: ["h-5", "h-4", "h-3"],
  },
} as const satisfies Record<string, RailLayout>;
/** Slides a Page Up or Page Down moves by. */
const PAGE = 10;
/** Wheel travel in pixels per slide, so one notch of a mouse wheel moves a slide or two. */
const WHEEL_STEP = 60;
/** Pointer travel in pixels before a press counts as a drag, not a click. */
const DRAG_SLOP = 3;
/** Height in pixels of the vertical rail at its tallest. */
const RAIL_HEIGHT = 192;
/** Milliseconds without a wheel event before a run of the wheel counts as over; long enough to take in the preview before the photo changes. */
const WHEEL_IDLE = 400;
/** Slightly underdamped, so the strip trails the pointer and settles with a small overshoot, as if it had weight. */
const GLIDE = { type: "spring", stiffness: 300, damping: 28 } as const;

/**
 * A short window onto a strip of ticks, one per slide, that fades out at both ends: click a tick to jump, or drag the strip to move through the set.
 * A drag or wheel run only previews; the slide on show changes once, when it ends, so photos of different shapes do not reflow the page as they pass.
 */
export const Scrubber = ({
  count,
  index,
  onIndexChange,
  onPreviewChange,
  orientation = "vertical",
  className,
}: ScrubberProps) => {
  const layout = LAYOUTS[orientation];
  const isHorizontal = orientation === "horizontal";
  const TICK = layout.tick;
  const railRef = useRef<HTMLDivElement>(null);
  /** Where a press began, and whether it has moved far enough to be a drag. */
  const press = useRef<{ at: number; index: number; dragged: boolean }>(null);
  const wheelTravel = useRef(0);
  const wheelIdle = useRef<ReturnType<typeof setTimeout>>(undefined);
  /** Mirrors `preview` for the wheel's idle timer, which outlives the render that set it. */
  const previewRef = useRef<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  /** The tick at the middle of the rail: the previewed slide during a drag, else the one on show. */
  const shown = preview ?? index;

  const clamp = (value: number) => Math.min(count - 1, Math.max(0, value));
  const go = (next: number) => next !== index && onIndexChange(next);
  const previewAt = (next: number | null) => {
    previewRef.current = next;
    setPreview(next);
    onPreviewChange?.(next);
  };
  const commitPreview = () => {
    const target = previewRef.current;
    wheelTravel.current = 0;
    if (target !== null) go(target);
    previewAt(null);
  };

  useEffect(() => () => clearTimeout(wheelIdle.current), []);
  /** A pointer's position along the rail. */
  const along = (event: React.PointerEvent) =>
    isHorizontal ? event.clientX : event.clientY;
  /** The current tick sits at the rail's middle, so a tick's index follows from its distance to that. */
  const indexAt = (position: number) => {
    const rect = railRef.current!.getBoundingClientRect();
    const middle = isHorizontal
      ? rect.left + rect.width / 2
      : rect.top + rect.height / 2;
    return clamp(shown + Math.round((position - middle) / TICK));
  };
  /** A short set gets a short rail: on a long one, most of the grab area would be empty space that jumps to an end. */
  const length = count * TICK + layout.margin;

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Position in the set"
      aria-orientation={orientation}
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={shown + 1}
      aria-valuetext={`${shown + 1} of ${count}`}
      onKeyDown={(event) => {
        const target = {
          ArrowUp: index - 1,
          ArrowDown: index + 1,
          PageUp: index - PAGE,
          PageDown: index + PAGE,
          Home: 0,
          End: count - 1,
        }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        go(clamp(target));
      }}
      onWheel={(event) => {
        wheelTravel.current += event.deltaY;
        const steps = Math.trunc(wheelTravel.current / WHEEL_STEP);
        if (!steps) return;
        wheelTravel.current -= steps * WHEEL_STEP;
        /** Read from the ref: several wheel events can land before one render. */
        previewAt(clamp((previewRef.current ?? index) + steps));
        clearTimeout(wheelIdle.current);
        wheelIdle.current = setTimeout(commitPreview, WHEEL_IDLE);
      }}
      /** A drag here drifts sideways too, which the lightbox would read as a swipe. */
      onTouchStart={(event) => event.stopPropagation()}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        /** Keeps the drag alive when the pointer strays off the rail. */
        event.currentTarget.setPointerCapture(event.pointerId);
        press.current = { at: along(event), index, dragged: false };
        setHovered(null);
      }}
      onPointerMove={(event) => {
        const held = press.current;
        if (!held) return setHovered(indexAt(along(event)));

        const travel = held.at - along(event);
        if (Math.abs(travel) > DRAG_SLOP) held.dragged = true;
        /** The strip follows the pointer, as a touch scroll does: drag up, or left, to move on. */
        if (held.dragged)
          previewAt(clamp(held.index + Math.round(travel / TICK)));
      }}
      onPointerUp={(event) => {
        if (press.current?.dragged) commitPreview();
        else if (press.current) go(indexAt(along(event)));
        press.current = null;
      }}
      onPointerCancel={() => {
        press.current = null;
        previewAt(null);
      }}
      onPointerLeave={() => setHovered(null)}
      className={cn(
        "relative cursor-grab select-none active:cursor-grabbing",
        layout.root,
        "opacity-70 transition-opacity duration-150 ease-linear hover:opacity-100 focus-visible:opacity-100 active:opacity-100",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-400",
        className,
      )}
      style={
        isHorizontal
          ? { width: `min(100%, ${length}px)` }
          : { height: Math.min(RAIL_HEIGHT, length) }
      }
    >
      <div
        ref={railRef}
        className={cn("relative size-full overflow-hidden", layout.mask)}
      >
        <m.div
          className={cn("absolute", layout.strip)}
          initial={false}
          animate={{ [isHorizontal ? "x" : "y"]: -(shown + 0.5) * TICK }}
          transition={GLIDE}
        >
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className={layout.cell}
              style={{ [isHorizontal ? "width" : "height"]: TICK }}
            >
              <span
                className={cn(
                  layout.mark,
                  "transition-[width,height,background-color] duration-150 ease-linear",
                  i === hovered && i !== shown
                    ? [layout.lengths[1], "bg-neutral-200/80"]
                    : [layout.lengths[2], "bg-neutral-300/50"],
                )}
              />
            </span>
          ))}
        </m.div>
        <span
          aria-hidden
          /** Fixed, not a tick in the strip: a tick marked as current blurs away when the strip moves fast. Its length follows the preview, not the strip's spring, so it is back to full as the photo lands. */
          className={cn(
            "pointer-events-none absolute bg-green-400",
            "transition-[width,height] duration-150 ease-linear",
            layout.mark,
            layout.needle,
            layout.lengths[preview === null ? 0 : 1],
          )}
        />
      </div>

      {!isHorizontal &&
        hovered !== null &&
        hovered !== shown &&
        preview === null && (
          <span
            aria-hidden
            /** Under the rail, not beside the tick, where it would sit over the previous button. */
            className="pointer-events-none absolute top-full left-2 font-mono text-[10px] tracking-wider text-neutral-300 tabular-nums"
          >
            {zeroPad(hovered + 1)}
          </span>
        )}
    </div>
  );
};
