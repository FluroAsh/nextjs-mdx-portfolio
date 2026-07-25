import { useEffect } from "react";

import { COMMAND_ACTIONS, type CommandAction } from "./actions";

const isTypingTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;

  return (
    element?.tagName === "INPUT" ||
    element?.tagName === "TEXTAREA" ||
    Boolean(element?.isContentEditable)
  );
};

type UseCommandShortcutsOptions = {
  open: boolean;
  onToggle: () => void;
  onSelect: (action: CommandAction) => void;
};

/**
 * Binds the palette's global entry points: cmd/ctrl+k toggles it, and single-key
 * shortcuts jump straight to a page while the palette is closed.
 */
export const useCommandShortcuts = ({
  open,
  onToggle,
  onSelect,
}: UseCommandShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // `key` is compared lowercased so the toggle survives Caps Lock; alt/shift
      // are excluded so we don't swallow chords like Firefox's cmd+shift+k.
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        onToggle();
        return;
      }

      // Bare keys are only shortcuts when no modifier could be claiming them —
      // ctrl+h, cmd+b and friends belong to the browser.
      if (
        open ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      const action = COMMAND_ACTIONS.find(
        (candidate) => candidate.shortcut === event.key.toLowerCase(),
      );

      if (!action) return;

      event.preventDefault();
      onSelect(action);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onSelect, onToggle]);
};
