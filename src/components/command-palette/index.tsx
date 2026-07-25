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
import { Command } from "cmdk";

import { cn } from "@/utils/misc";

import { BLOG_ACTIONS, type CommandAction, PAGE_ACTIONS } from "./actions";
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

type CommandPaletteItemProps = {
  action: CommandAction;
  onSelect: (action: CommandAction) => void;
};

const CommandPaletteItem = ({ action, onSelect }: CommandPaletteItemProps) => (
  <Command.Item
    value={action.name}
    keywords={action.keywords}
    onSelect={() => onSelect(action)}
    className={cn(
      "group flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-neutral-400 transition-colors",
      "data-[selected=true]:bg-neutral-800/80 data-[selected=true]:text-neutral-100",
      "data-[selected=false]:hover:bg-neutral-900/80",
    )}
  >
    <div className="flex min-w-0 items-center gap-3">
      {action.icon && (
        <div className="flex shrink-0 items-center justify-center text-neutral-500 group-data-[selected=true]:text-green-400 [&_svg]:size-5">
          {action.icon}
        </div>
      )}
      <div className="min-w-0">
        <span>{action.name}</span>
        {action.subtitle && (
          <div className="line-clamp-1 text-sm text-neutral-600">
            {action.subtitle}
          </div>
        )}
      </div>
    </div>

    {action.shortcut && (
      <kbd
        aria-hidden
        className="flex size-6 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500"
      >
        {action.shortcut}
      </kbd>
    )}
  </Command.Item>
);

type CommandPaletteGroupProps = {
  heading: string;
  actions: CommandAction[];
  onSelect: (action: CommandAction) => void;
};

const CommandPaletteGroup = ({
  heading,
  actions,
  onSelect,
}: CommandPaletteGroupProps) => (
  <Command.Group
    heading={heading}
    className="[&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:border-t [&_[cmdk-group-heading]]:border-green-900/30 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-6 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-green-500/70 [&_[cmdk-group-heading]]:uppercase"
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
        overlayClassName="fixed inset-0 z-50 backdrop-blur-xl backdrop-filter"
        contentClassName="fixed top-[10vh] left-1/2 z-50 min-h-fit w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-green-900/30 bg-black/80 p-4 shadow-lg shadow-black/30"
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
        <div className="[&:has(+div)]:pb-4">
          <div className="flex items-center space-x-4 rounded-lg border border-green-800/20 bg-neutral-900/70 p-3">
            <Command.Input
              autoFocus
              placeholder="Search pages, posts..."
              className="h-8 w-full bg-transparent text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <kbd className="inline-flex items-center justify-center rounded border border-green-800/30 bg-neutral-800/80 px-1.5 py-0.5 text-xs font-medium tracking-wide text-green-400/80">
              ESC
            </kbd>
          </div>
        </div>
        <Command.List className="max-h-[70vh] overflow-y-auto pt-2">
          <Command.Empty className="px-4 py-6 text-center text-sm text-neutral-500">
            No results found.
          </Command.Empty>
          {/*
            Pages sit first so their shortcuts stay above the fold on an empty
            search; cmdk re-orders groups by match score once you start typing.
          */}
          <CommandPaletteGroup
            heading="Page"
            actions={PAGE_ACTIONS}
            onSelect={selectAction}
          />
          <CommandPaletteGroup
            heading="Blog Posts"
            actions={BLOG_ACTIONS}
            onSelect={selectAction}
          />
        </Command.List>
      </Command.Dialog>
      {children}
    </CommandPaletteContext.Provider>
  );
};
