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
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onToggle();
        return;
      }

      // Bare keys are only shortcuts when nothing else could be claiming them.
      if (
        open ||
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
