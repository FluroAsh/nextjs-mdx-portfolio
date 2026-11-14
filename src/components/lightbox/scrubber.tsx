"use client";

import { useEffect, useRef, useState } from "react";

import { cn, zeroPad } from "@/utils/misc";

type ScrubberProps = {
  /** Number of slides in the set; one tick each. */
  count: number;
  /** Index of the slide on show; its tick sits at the middle of the rail. */
  index: number;
  onIndexChange: (index: number) => void;
  /** Told when a drag or a run of the wheel starts and ends: the moments slides change too fast to take in one at a time. */
  onScrubbingChange?: (isScrubbing: boolean) => void;
  className?: string;
};

/** Pixels from one tick to the next; also how far a drag travels per slide. */
const TICK = 6;
/** Slides a Page Up or Page Down moves by. */
const PAGE = 10;
/** Wheel travel in pixels per slide, so one notch of a mouse wheel moves a slide or two. */
const WHEEL_STEP = 60;
/** Pointer travel in pixels before a press counts as a drag, not a click. */
const DRAG_SLOP = 3;
/** Milliseconds without a wheel event before a run of the wheel counts as over. */
const WHEEL_IDLE = 300;

/** A short window onto a strip of ticks, one per slide, that fades out at both ends: click a tick to jump, or drag the strip to move through the set. */
export const Scrubber = ({
  count,
  index,
  onIndexChange,
  onScrubbingChange,
  className,
}: ScrubberProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  /** Where a press began, and whether it has moved far enough to be a drag. */
  const press = useRef<{ y: number; index: number; dragged: boolean }>(null);
  const wheelTravel = useRef(0);
  const wheelIdle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hovered, setHovered] = useState<number | null>(null);

  const clamp = (value: number) => Math.min(count - 1, Math.max(0, value));
  const go = (next: number) => next !== index && onIndexChange(next);

  /** Closing the lightbox mid-drag unmounts this before the pointer lifts. */
  useEffect(
    () => () => {
      clearTimeout(wheelIdle.current);
      onScrubbingChange?.(false);
    },
    [onScrubbingChange],
  );

  const endPress = () => {
    if (press.current?.dragged) onScrubbingChange?.(false);
    press.current = null;
  };
  /** The current tick sits at the rail's middle, so a tick's index follows from its distance to that. */
  const indexAt = (clientY: number) => {
    const { top, height } = railRef.current!.getBoundingClientRect();
    return clamp(index + Math.round((clientY - top - height / 2) / TICK));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Position in the set"
      aria-orientation="vertical"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={index + 1}
      aria-valuetext={`${index + 1} of ${count}`}
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
        onScrubbingChange?.(true);
        clearTimeout(wheelIdle.current);
        wheelIdle.current = setTimeout(
          () => onScrubbingChange?.(false),
          WHEEL_IDLE,
        );
        wheelTravel.current += event.deltaY;
        const steps = Math.trunc(wheelTravel.current / WHEEL_STEP);
        if (!steps) return;
        wheelTravel.current -= steps * WHEEL_STEP;
        go(clamp(index + steps));
      }}
      onPointerDown={(event) => {
        /** Keeps the drag alive when the pointer strays off the rail. */
        event.currentTarget.setPointerCapture(event.pointerId);
        press.current = { y: event.clientY, index, dragged: false };
        setHovered(null);
      }}
      onPointerMove={(event) => {
        const held = press.current;
        if (!held) return setHovered(indexAt(event.clientY));

        const travel = held.y - event.clientY;
        if (!held.dragged && Math.abs(travel) > DRAG_SLOP) {
          held.dragged = true;
          onScrubbingChange?.(true);
        }
        /** The strip follows the pointer, as a touch scroll does: drag up to move on. */
        if (held.dragged) go(clamp(held.index + Math.round(travel / TICK)));
      }}
      onPointerUp={(event) => {
        if (press.current && !press.current.dragged) go(indexAt(event.clientY));
        endPress();
      }}
      onPointerCancel={endPress}
      onPointerLeave={() => setHovered(null)}
      className={cn(
        "relative h-48 w-8 cursor-grab touch-none select-none active:cursor-grabbing",
        "opacity-70 transition-opacity duration-150 ease-linear hover:opacity-100 focus-visible:opacity-100",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-400",
        className,
      )}
    >
      <div
        ref={railRef}
        className="relative size-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]"
      >
        <div
          className="absolute top-1/2 left-0 transition-transform duration-150 ease-out"
          style={{ transform: `translateY(${-(index + 0.5) * TICK}px)` }}
        >
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="flex items-center pl-2"
              style={{ height: TICK }}
            >
              <span
                className={cn(
                  "h-px transition-[width,background-color] duration-150 ease-linear",
                  i === index
                    ? "w-5 bg-green-400"
                    : i === hovered
                      ? "w-4 bg-neutral-200/80"
                      : "w-3 bg-neutral-300/50",
                )}
              />
            </span>
          ))}
        </div>
      </div>

      {hovered !== null && hovered !== index && (
        <span
          aria-hidden
          className="bg-surface-page/85 pointer-events-none absolute top-1/2 left-full z-10 -translate-y-1/2 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-neutral-300 tabular-nums"
          style={{ marginTop: (hovered - index) * TICK }}
        >
          {zeroPad(hovered + 1)}
        </span>
      )}
    </div>
  );
};
