/**
 * PROTOTYPE, throwaway: zoom for the lightbox photo with `@panzoom/panzoom`, to judge how it feels before it is built properly.
 * Wheel or pinch to zoom, drag to pan once zoomed, double-click or double-tap to toggle 2x.
 */
import { useEffect, useRef, useState } from "react";

import type { PanzoomObject } from "@panzoom/panzoom";

const MAX_SCALE = 4;
const DOUBLE_CLICK_SCALE = 2;

export const usePrototypeZoom = (isSuspended: boolean) => {
  /** Held in state, not a ref: the dialog mounts the photo a render after it opens, and each slide remounts it. */
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const panzoom = useRef<PanzoomObject | null>(null);
  const [zoomed, setZoomed] = useState<{
    image: HTMLImageElement;
    scale: number;
  }>();

  useEffect(() => {
    const clip = image?.parentElement;
    if (!image || !clip) return;

    let instance: PanzoomObject | undefined;
    let isGone = false;

    const onChange = (event: Event) => {
      const { scale } = (event as CustomEvent<{ scale: number }>).detail;
      setZoomed({ image, scale });
      image.style.cursor = scale > 1 ? "grab" : "zoom-in";
      /** At rest a vertical drag must still scroll the page; zoomed, every drag pans the photo. */
      clip.style.touchAction = scale > 1 ? "none" : "pan-y";
    };
    const onWheel = (event: WheelEvent) => instance?.zoomWithWheel(event);
    const onDoubleClick = (event: MouseEvent) => {
      if (!instance) return;
      if (instance.getScale() > 1) instance.reset();
      else instance.zoomToPoint(DOUBLE_CLICK_SCALE, event, { animate: true });
    };

    /** Loaded on demand, so the library is only fetched once a lightbox opens. */
    import("@panzoom/panzoom").then(({ default: Panzoom }) => {
      if (isGone) return;
      instance = Panzoom(image, {
        minScale: 1,
        maxScale: MAX_SCALE,
        step: 0.25,
        contain: "outside",
        panOnlyWhenZoomed: true,
        cursor: "zoom-in",
        touchAction: "pan-y",
      });
      panzoom.current = instance;
      image.addEventListener("panzoomchange", onChange);
      image.addEventListener("dblclick", onDoubleClick);
      clip.addEventListener("wheel", onWheel);
    });

    return () => {
      isGone = true;
      image.removeEventListener("panzoomchange", onChange);
      image.removeEventListener("dblclick", onDoubleClick);
      clip.removeEventListener("wheel", onWheel);
      instance?.destroy();
      panzoom.current = null;
    };
  }, [image]);

  useEffect(() => {
    if (isSuspended) panzoom.current?.reset({ animate: false });
  }, [isSuspended]);

  return {
    zoomImageRef: setImage,
    scale: zoomed && zoomed.image === image ? zoomed.scale : 1,
  };
};
