import { type RefObject, useEffect, useRef, useState } from "react";

/** Sideways travel in pixels before a touch counts as a swipe. */
const SWIPE_DISTANCE = 50;
/** Downward travel in pixels past which letting go closes the lightbox. */
const DISMISS_DISTANCE = 120;
/** Downward speed in pixels a millisecond that closes on a shorter pull, and the pull it still needs. */
const FLICK_SPEED = 0.5;
const FLICK_DISTANCE = 40;
/** Milliseconds the lightbox takes to slide away or spring back. */
const SETTLE_MS = 200;

type TouchGestures = {
  /** A swipe to the right. */
  onPrevious: () => void;
  /** A swipe to the left. */
  onNext: () => void;
  /** A pull down from the top. */
  onDismiss: () => void;
  /** The backdrop, which fades as the lightbox is pulled down. */
  overlayRef: RefObject<HTMLElement | null>;
};

/**
 * The lightbox's touch gestures: swipe sideways to step, pull down from the top to close.
 * Returns a ref for the area that takes them. One touch is one gesture, decided by the way it sets off.
 */
export const useTouchGestures = (gestures: TouchGestures) => {
  /** Held in state, not a ref: the dialog mounts its content a render after it opens. */
  const [area, setArea] = useState<HTMLElement | null>(null);
  const latest = useRef(gestures);
  useEffect(() => {
    latest.current = gestures;
  });

  useEffect(() => {
    /** The dialog's content is what scrolls and what slides away. */
    const sheet = area?.closest<HTMLElement>("[role=dialog]");
    if (!area || !sheet) return;

    let start: { x: number; y: number; time: number } | null = null;
    let isDismissing = false;
    let closing: ReturnType<typeof setTimeout> | undefined;

    const settle = (transform: string, opacity: string) => {
      const overlay = latest.current.overlayRef.current;
      const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : SETTLE_MS;
      sheet.style.transition = `transform ${duration}ms ease-out`;
      sheet.style.transform = transform;
      if (overlay) {
        overlay.style.transition = `opacity ${duration}ms ease-out`;
        overlay.style.opacity = opacity;
      }
      return duration;
    };

    const onStart = (event: TouchEvent) => {
      const target = event.target as Element;
      /** A pinch is neither gesture, and the scrubber rail has its own drag. */
      const isOurs =
        event.touches.length === 1 && !target.closest("[role=slider]");
      const touch = event.touches[0];
      start = isOurs
        ? { x: touch.clientX, y: touch.clientY, time: event.timeStamp }
        : null;
      isDismissing = false;
    };

    const onMove = (event: TouchEvent) => {
      if (!start) return;
      const dx = event.touches[0].clientX - start.x;
      const dy = event.touches[0].clientY - start.y;

      /** Decided on the first move, the only one a browser lets a page cancel before it starts to scroll. Only from the top, so a drag up still scrolls to what is below. */
      if (!isDismissing) {
        if (dy <= Math.abs(dx) || sheet.scrollTop > 0) return;
        isDismissing = true;
      }

      event.preventDefault();
      const pull = Math.max(0, dy);
      const overlay = latest.current.overlayRef.current;
      sheet.style.transition = "none";
      sheet.style.transform = `translateY(${pull}px)`;
      if (overlay) {
        overlay.style.transition = "none";
        overlay.style.opacity = String(1 - Math.min(1, pull / innerHeight));
      }
    };

    const onEnd = (event: TouchEvent) => {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const speed = dy / Math.max(1, event.timeStamp - start.time);
      start = null;

      if (isDismissing) {
        isDismissing = false;
        const isClosing =
          dy > DISMISS_DISTANCE || (dy > FLICK_DISTANCE && speed > FLICK_SPEED);
        if (!isClosing) return void settle("", "");
        closing = setTimeout(
          () => latest.current.onDismiss(),
          settle("translateY(100%)", "0"),
        );
        return;
      }

      /** Mostly sideways only, so scrolling with some drift does not change the photo. */
      if (Math.abs(dx) <= Math.abs(dy)) return;
      if (dx > SWIPE_DISTANCE) latest.current.onPrevious();
      if (dx < -SWIPE_DISTANCE) latest.current.onNext();
    };

    const onCancel = () => {
      if (isDismissing) settle("", "");
      start = null;
      isDismissing = false;
    };

    area.addEventListener("touchstart", onStart, { passive: true });
    /** Not passive: a pull down has to stop the browser's own scroll and overscroll. */
    area.addEventListener("touchmove", onMove, { passive: false });
    area.addEventListener("touchend", onEnd);
    area.addEventListener("touchcancel", onCancel);
    return () => {
      clearTimeout(closing);
      area.removeEventListener("touchstart", onStart);
      area.removeEventListener("touchmove", onMove);
      area.removeEventListener("touchend", onEnd);
      area.removeEventListener("touchcancel", onCancel);
    };
  }, [area]);

  return setArea;
};
