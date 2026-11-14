import { useEffect, useRef } from "react";

/** Marks the history entry the lightbox added, so only that entry is ever stepped back over. */
const ENTRY = "lightbox";

/**
 * Makes the back button or gesture close the lightbox, not leave the page: opening adds a history entry,
 * going back closes, and closing any other way removes the entry.
 */
export const useBackToClose = (isOpen: boolean, onClose: () => void) => {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    history.pushState({ ...history.state, [ENTRY]: true }, "");
    const onPop = () => latest.current();
    addEventListener("popstate", onPop);

    return () => {
      removeEventListener("popstate", onPop);
      /** Still on our entry means it was closed from the page, not by going back or by following a link away, either of which has already left it. */
      if (history.state?.[ENTRY]) history.back();
    };
  }, [isOpen]);
};
