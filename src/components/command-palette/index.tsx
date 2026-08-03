"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  Description as DialogDescription,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Command, useCommandState } from "cmdk";

import { BilingualLabel } from "@/components/bilingual-label";
import { ScanlinePlane } from "@/components/scanline-plane";
import type { BilingualPair } from "@/data/identity";
import { cn, zeroPad } from "@/utils/misc";

import { COMMAND_GROUPS, type CommandAction } from "./actions";
import { ExitIcon, KeyHint, NavIcons, OpenIcon } from "./key-hint";
import { useCommandShortcuts } from "./use-command-shortcuts";

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error(
      "useCommandPalette must be used within a CommandPalette provider",
    );
  }

  return context;
};

/** Has to be a child of `Command` — `useCommandState` reads the store by context. */
const ResultCount = () => {
  const count = useCommandState((state) => state.filtered.count);

  return (
    <span className="shrink-0 font-mono text-[10px] tracking-wider text-green-600 tabular-nums">
      {zeroPad(count)}
    </span>
  );
};

const CommandPaletteItem = ({
  action,
  onSelect,
}: {
  action: CommandAction;
  onSelect: (action: CommandAction) => void;
}) => (
  <Command.Item
    value={action.name}
    keywords={action.keywords}
    onSelect={() => onSelect(action)}
    className={cn(
      // `py-3` is the 44px minimum touch target; a pointer doesn't need it.
      "group flex cursor-pointer items-center gap-3 px-4 py-3 sm:py-1.5",
      "border-l-2 border-transparent text-neutral-400",
      "data-[selected=true]:border-green-400 data-[selected=true]:bg-green-400/15",
      "data-[selected=true]:text-neutral-100",
    )}
  >
    <span className="min-w-0 flex-1 truncate text-sm">{action.name}</span>
    {action.shortcut && (
      <span className="hidden shrink-0 font-mono text-[10px] tracking-wider text-green-600 uppercase group-data-[selected=true]:text-green-400 sm:inline">
        {action.shortcut}
      </span>
    )}
  </Command.Item>
);

const CommandPaletteGroup = ({
  marker,
  actions,
  onSelect,
}: {
  marker: BilingualPair;
  actions: CommandAction[];
  onSelect: (action: CommandAction) => void;
}) => (
  <Command.Group
    heading={<BilingualLabel {...marker} />}
    className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-1.5"
  >
    {actions.map((action) => (
      <CommandPaletteItem key={action.id} action={action} onSelect={onSelect} />
    ))}
  </Command.Group>
);

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((current) => !current), []);

  const selectAction = useCallback(
    (action: CommandAction) => {
      setOpen(false);
      router.push(action.href);
    },
    [router],
  );

  useCommandShortcuts({ open, onToggle: toggle, onSelect: selectAction });

  const contextValue = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Palette"
        overlayClassName="fixed inset-0 z-50 bg-surface-page/60 backdrop-blur-md"
        contentClassName={cn(
          "fixed left-1/2 z-50 -translate-x-1/2",
          // Centred by translate, so `w-full` would run edge to edge on a phone.
          "w-[calc(100%-32px)] max-w-xl",
          // Top-anchored: the panel is content-sized, so centring it vertically
          // moves the whole box on every keystroke as results filter.
          "top-4 max-h-[calc(100dvh-32px)]",
          "sm:top-[10vh] sm:max-h-[80vh]",
          "clip-chamfer flex flex-col bg-green-500/25 p-px",
          "shadow-[0_24px_60px_-12px_rgb(0_0_0/0.9)]",
        )}
        // Every box between the capped dialog and the list needs `min-h-0`, or a
        // flex child refuses to shrink below its content and the cap does nothing.
        className="flex min-h-0 flex-1 flex-col"
      >
        <VisuallyHidden asChild>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Search for pages and blog posts, or jump to a section with a
            keyboard shortcut.
          </DialogDescription>
        </VisuallyHidden>

        <div
          className="clip-chamfer relative isolate flex min-h-0 flex-1 flex-col"
          style={
            {
              /** Must stay opaque, or the border layer beneath shows through the whole panel. */
              background:
                "color-mix(in oklab, white 3.5%, var(--surface-page))",
              /** The section value is tuned for a much taller plane; over a box this size it disappears. */
              "--scanline-color": "rgba(74, 222, 128, 0.1)",
            } as React.CSSProperties
          }
        >
          <ScanlinePlane vignette={0.18} />

          <div className="flex items-center gap-3 border-b border-green-500/15 px-4 py-3">
            <BilingualLabel zh="檢索" en="SEARCH" className="shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type to filter..."
              className={cn(
                "h-6 min-w-0 flex-1 bg-transparent",
                "text-sm text-neutral-100",
                "placeholder:text-neutral-600 focus:outline-none",
              )}
            />
            <ResultCount />
          </div>

          <Command.List className="scrollbar-slim min-h-0 flex-1 overflow-y-auto pb-3">
            <Command.Empty className="px-4 py-6 text-center font-mono text-[11px] tracking-wider text-green-600 uppercase">
              No results
            </Command.Empty>

            {COMMAND_GROUPS.map((group) => (
              <CommandPaletteGroup
                key={group.marker.en}
                marker={group.marker}
                actions={group.actions}
                onSelect={selectAction}
              />
            ))}
          </Command.List>

          <div className="hidden items-center gap-4 border-t border-green-500/15 px-4 py-2 sm:flex">
            <KeyHint icon={NavIcons} label="Nav" />
            <KeyHint icon={OpenIcon} label="Open" />
            <KeyHint icon={ExitIcon} label="Exit" />
          </div>
        </div>
      </Command.Dialog>
      {children}
    </CommandPaletteContext.Provider>
  );
};
